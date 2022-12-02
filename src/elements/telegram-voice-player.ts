import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { durationToTime } from '~/utils/time';
import { filterData, normalizeData } from '~/utils/audio';
import { getCssCustomVariable } from '~/utils/style';
import { setupCanvas, drawBars } from '~/utils/draw';
import playSvg from '~/assets/svg/play';
import pauseSvg from '~/assets/svg/pause';
import loadingSpinnerSvg from '~/assets/svg/loading-spinner';

@customElement('telegram-voice-player')
export class TelegramVoicePlayer extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
      direction: ltr;
      font-size: 16px;
      width: 300px;

      --container-border-radius: 0.875em;
      --container-background: #1566a3;
      --play-btn-background: #fff;
      --play-btn-color: #1566a3;
      --text-color: #b7d9f3;
      --sound-bar-color: #b7d9f3;
      --sound-progress-color: #fff;
    }

    * {
      box-sizing: border-box;
      user-select: none;
    }

    #container {
      height: 4em;
      background: var(--container-background);
      border-radius: var(--container-border-radius);
      padding: 0.5em 0.625em;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
    }

    #play {
      font-size: 1em;
      flex: 0 0 auto;
      width: 3em;
      height: 3em;
      background: var(--play-btn-background);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1em;
      border: none;
      cursor: pointer;
      color: var(--play-btn-color);
      padding: 0;
    }

    #play:disabled {
      cursor: default;
    }

    #play > svg {
      width: 1em;
      height: 1em;
    }

    #play > .play-icon {
      position: relative;
      right: -1px;
    }

    #play > .loading-icon {
      width: 2em;
      height: 2em;
      transition: all 0.3s ease 0s;
      transform-origin: center center;
      animation: rotate 1.5s linear infinite;
    }

    #play > .loading-icon > circle {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1s ease-in-out infinite;
    }

    #details {
      flex: 1 1 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      height: 100%;
    }

    #canvas {
      flex: 1 1 auto;
      height: 0;
      width: 100%;
      cursor: pointer;
      margin: 0.2em 0;
    }

    #canvas.mirrored {
      margin: 0;
    }

    #info {
      margin-top: 0.33em;
      flex: 0 0 auto;
      width: 100%;
      align-items: flex-end;
      font-size: 0.7em;
      line-height: 1.25em;
      color: var(--text-color);
      display: flex;
      justify-content: space-between;
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }

      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }

    @keyframes rotate {
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String }) src = '';
  @property({ type: Number, reflect: true }) bars = 64;
  @property({ type: Boolean, reflect: true }) mirroredBars = true;
  @property({ type: Boolean, attribute: false }) initiated = false;
  @property({ type: Boolean, attribute: false }) isPlaying = false;
  @property({ type: Number, attribute: false }) totalTime = 234;
  @property({ type: Number, attribute: false }) currentTime = 0;
  @property({ type: Boolean, attribute: false }) isPending = true;
  @property({ type: Boolean, attribute: false }) hasLoaded = false;
  @property({ type: Boolean, attribute: false }) hasError = false;
  @property({ attribute: false }) audio = new Audio();
  @property({ attribute: false }) audioBuffer?: AudioBuffer;
  @property({ attribute: false }) context: AudioContext | null = null;

  override render() {
    return html`
      <div id="container">
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.hasLoaded}>
          ${this.isPending ? loadingSpinnerSvg : this.isPlaying ? pauseSvg : playSvg}
        </button>
        <div id="details">
          <canvas id="canvas" class=${this.mirroredBars ? 'mirrored' : ''}></canvas>
          <div id="info">
            <span class="current">${this.hasLoaded ? durationToTime(this.currentTime) : '--:--'}</span>
            <span class="total">${this.hasLoaded ? durationToTime(this.totalTime) : '--:--'}</span>
          </div>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override firstUpdated() {
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    const data = new Array(this.bars).fill(0);
    const color = getCssCustomVariable(this.renderRoot, 'sound-bar-color');
    if (!this.initiated) setupCanvas(canvas);
    drawBars(canvas, data, 2 / 9, color, { async: false, mirror: this.mirroredBars });

    this._loadAudio();
  }

  override updated(changed: Map<string, unknown>) {
    if (!this.initiated) return;

    if (changed.has('bars') || changed.has('mirroredBars')) {
      const normalizeData = this._processAudio(this.audioBuffer as AudioBuffer);
      if (changed.has('mirroredBars')) {
        const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
        setupCanvas(canvas);
      }
      this._drawAudioBars(normalizeData);
    }

    if (changed.has('src')) {
      this._loadAudio();
    }
  }

  private _loadAudio() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    this.context = audioContext;
    fetch(this.src)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((arrayBuffer) => this._processAudio(arrayBuffer))
      .then((normalizeData) => {
        this._setupAudio();
        return this._drawAudioBars(normalizeData);
      })
      .then(() => this._setupProgressEvents())
      .then(() => (this.initiated = true));
  }

  private _processAudio(audioBuffer: AudioBuffer) {
    this.audioBuffer = audioBuffer;
    const filteredData = filterData(audioBuffer, this.bars);
    const normalizedData = normalizeData(filteredData);
    return normalizedData;
  }

  private async _drawAudioBars(normalizedData: number[]) {
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    const color = getCssCustomVariable(this.renderRoot, 'sound-bar-color');
    await drawBars(canvas, normalizedData, 2 / 9, color, { async: false, mirror: this.mirroredBars });
  }

  private _setupProgressEvents() {
    if (this.initiated) return;

    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    let lmbActive = false;
    const onProgressChange = (progress: number) => {
      this.audio.currentTime = progress * this.totalTime * 0.01;
    };

    window.addEventListener('mouseup', () => {
      lmbActive = false;
    });

    canvas.addEventListener('mousedown', (e) => {
      lmbActive = true;
      onProgressChange((e.offsetX / canvas.offsetWidth) * 100);
    });

    window.addEventListener(
      'mousemove',
      (e) => {
        if (!lmbActive) return;

        const boundingRect = canvas.getBoundingClientRect();
        const leftSide = boundingRect.left;
        const rightSide = boundingRect.left + boundingRect.width;

        const progress = e.clientX;
        let progressPercentage = 0;
        if (progress < leftSide) {
          progressPercentage = 0;
        } else if (progress > rightSide) {
          progressPercentage = 100;
        } else {
          progressPercentage = ((progress - leftSide) / (rightSide - leftSide)) * 100;
        }

        onProgressChange(progressPercentage);
      },
      { passive: true }
    );
  }

  private _drawAudioProgress(progress: number) {
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = getCssCustomVariable(this.renderRoot, 'sound-bar-color');
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = getCssCustomVariable(this.renderRoot, 'sound-progress-color');
    ctx.fillRect(0, 0, (width * progress) / 100, height);
  }

  private _setupAudio() {
    this.audio = new Audio();
    this.audio.autoplay = false;
    this.audio.src = this.src;
    this.audio.loop = false;

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this._drawAudioProgress((this.audio.currentTime / this.audio.duration) * 100);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.totalTime = this.audio.duration;
      this.currentTime = 0;
    });

    this.audio.addEventListener('loadeddata', () => {
      if (this.audio.readyState >= 2) {
        this.isPending = false;
        this.hasLoaded = true;
        this.hasError = false;
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.isPlaying) {
        this.audio.currentTime = 0;
        this.isPlaying = false;
      }
    });

    this.audio.addEventListener('error', () => {
      this.hasLoaded = false;
      this.isPending = false;
      this.hasError = true;
    });
  }

  private _playOrPause() {
    if (this.audio.readyState >= 2) {
      if (this.context !== null && this.context.state === 'suspended') {
        this.context.resume();
      }

      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'telegram-voice-player': TelegramVoicePlayer;
  }
}
