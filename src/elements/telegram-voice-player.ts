import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { durationToTime } from '~/utils/time';
import { filterData, normalizeData } from '~/utils/audio';
import playSvg from '~/assets/svg/play';
import pauseSvg from '~/assets/svg/pause';
import loadingSpinnerSvg from '~/assets/svg/loading-spinner';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('telegram-voice-player')
export class TelegramVoicePlayer extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
      direction: ltr;
    }

    * {
      box-sizing: border-box;
      user-select: none;
    }

    #container {
      width: 268px;
      height: 62px;
      background: #212145;
      border-radius: 14px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
    }

    #play {
      flex: 0 0 auto;
      width: 45px;
      height: 45px;
      background: #5562ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      border: none;
      cursor: pointer;
      color: #fff;
      padding: 0;
    }

    #play:disabled {
      cursor: default;
    }

    #play > svg {
      width: 15px;
      height: 15px;
    }

    #play > .play-icon {
      position: relative;
      right: -1px;
    }

    #play > .loading-icon {
      width: 40px;
      height: 40px;
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
    }

    #canvas {
      flex: 0 0 auto;
      width: 100%;
      height: 30px;
      cursor: pointer;
    }

    #info {
      margin-top: 5px;
      flex: 1 1 100%;
      width: 100%;
      align-items: flex-end;
      font-size: 11px;
      color: #5b5c88;
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
  @property({ type: Boolean, attribute: false }) isPlaying = false;
  @property({ type: Number, attribute: false }) totalTime = 234;
  @property({ type: Number, attribute: false }) currentTime = 0;
  @property({ type: Boolean, attribute: false }) isPending = true;
  @property({ type: Boolean, attribute: false }) isLoaded = false;
  @property({ attribute: false }) audio = new Audio();

  override render() {
    return html`
      <div id="container">
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.isLoaded}>
          ${this.isPending ? loadingSpinnerSvg : this.isPlaying ? pauseSvg : playSvg}
        </button>
        <div id="details">
          <canvas id="canvas"></canvas>
          ${this.isLoaded
            ? html` <div id="info">
                <span class="current">${durationToTime(this.currentTime)}</span>
                <span class="total">${durationToTime(this.totalTime)}</span>
              </div>`
            : null}
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    this._loadAudio();
  }

  private _loadAudio() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    fetch(this.src)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => this._drawAudioBars(audioBuffer))
      .then(() => this._setupAudio());
  }

  private async _drawAudioBars(audioBuffer: AudioBuffer) {
    const filteredData = filterData(audioBuffer, 50);
    const normalizedData = normalizeData(filteredData);

    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth / normalizedData.length;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.scale(dpr, dpr);
    ctx.translate(0, canvas.offsetHeight / 2);

    const bodyRatio = 2 / 3;

    for (let i = 0; i < normalizedData.length; i++) {
      const x = width * i;
      let height = normalizedData[i] * canvas.offsetHeight;
      if (height < 0) {
        height = 0;
      } else if (height + width / 2 > canvas.offsetHeight) {
        height = canvas.offsetHeight - width / 2;
      }

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          ctx.fillStyle = '#5b5c88';
          ctx.fillRect(x, height / -2, width * bodyRatio, height);
          ctx.beginPath();
          ctx.arc(x + (width * bodyRatio) / 2, height / 2, (width * bodyRatio) / 2, 0, Math.PI * 2);
          ctx.arc(x + (width * bodyRatio) / 2, height / -2, (width * bodyRatio) / 2, 0, Math.PI * 2);
          ctx.fill();

          resolve(true);
        });
      });
    }

    const onProgressChange = (progress: number) => {
      this.audio.currentTime = progress * this.totalTime * 0.01;
    };

    let isLbPressed = false;
    canvas.addEventListener('mousedown', (e) => {
      isLbPressed = true;
      onProgressChange((e.offsetX / canvas.offsetWidth) * 100);
    });
    canvas.addEventListener('mouseup', () => (isLbPressed = false));
    canvas.addEventListener('mousemove', (e) => {
      if (isLbPressed) {
        onProgressChange((e.offsetX / canvas.offsetWidth) * 100);
      }
    });
  }

  private _drawAudioProgress(progress: number) {
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = '#5b5c88';
    ctx.fillRect(0, height / -2, width, height);

    ctx.fillStyle = '#5562ff';
    ctx.fillRect(0, height / -2, (width * progress) / 100, height);
  }

  private _setupAudio() {
    this.audio = new Audio();
    this.audio.src = this.src;

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = Math.floor((this.audio.currentTime / this.audio.duration) * 100);
      this._drawAudioProgress(this.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.totalTime = this.audio.duration;
      this.currentTime = 0;
      this.isLoaded = true;
      this.isPending = false;
    });
  }

  private _playOrPause() {
    if (this.audio.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
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
