import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { durationToTime } from '~/utils/time';
import { filterData, normalizeData } from '~/utils/audio';
import { getCssCustomVariable } from '~/utils/style';
import { setupCanvas, drawBars, drawCircularWave, drawCircularBars } from '~/utils/draw';
import playSvg from '~/assets/svg/play';
import pauseSvg from '~/assets/svg/pause';
import loadingSpinnerSvg from '~/assets/svg/loading-spinner';

@customElement('play-wave')
export class PlayWave extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
      direction: ltr;
      font-size: 16px;
      /* width: 300px; */

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
      position: relative;
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
      border: none;
      cursor: pointer;
      color: var(--play-btn-color);
      padding: 0;
      position: relative;
      z-index: 1;
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

    #canvas {
      position: absolute;
      z-index: 0;
      width: 6em;
      height: 6em;
      top: calc(50% - 3em);
      left: calc(50% - 3em);
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

  override render() {
    return html`
      <div id="container">
        <canvas id="canvas"></canvas>
        <button id="play" @click=${this._playOrPause} ?disabled=${!this.hasLoaded}>
          ${this.isPending ? loadingSpinnerSvg : this.isPlaying ? pauseSvg : playSvg}
        </button>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  override firstUpdated() {
    // const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    // const data = new Array(this.bars).fill(0);
    // const color = getCssCustomVariable(this.renderRoot, 'sound-bar-color');
    // if (!this.initiated) setupCanvas(canvas);
    // drawBars(canvas, data, 2 / 9, color, { async: false, mirror: this.mirroredBars });

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
    fetch(this.src)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((arrayBuffer) => this._processAudio(arrayBuffer))
      .then(() => {
        this._setupAudio();
        // return this._drawAudioBars(normalizeData);
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

  private _setupAudio() {
    this.audio = new Audio();
    this.audio.autoplay = false;
    this.audio.src = this.src;
    this.audio.loop = false;

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      // this._drawAudioProgress((this.audio.currentTime / this.audio.duration) * 100);
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

    const audioCtx = new AudioContext();
    const analyser = new AnalyserNode(audioCtx, {
      fftSize: 512,
    });
    const source = audioCtx.createMediaElementSource(this.audio);
    source.connect(analyser);
    source.connect(audioCtx.destination);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    if (!this.initiated) setupCanvas(canvas);

    let shiftAngle = 0;

    const loopingFunction = () => {
      requestAnimationFrame(loopingFunction);

      if (!this.isPlaying) return;

      const waveGradient = (canvas.getContext('2d') as CanvasRenderingContext2D).createConicGradient(0, 0, 0);
      waveGradient.addColorStop(0, `hsla(${(0 + shiftAngle) % 360}deg, 100%, 50%, 0.5)`);
      waveGradient.addColorStop(0.25, `hsla(${(90 + shiftAngle) % 360}deg, 100%, 50%, 0.5)`);
      waveGradient.addColorStop(0.5, `hsla(${(180 + shiftAngle) % 360}deg, 100%, 50%, 0.5)`);
      waveGradient.addColorStop(0.75, `hsla(${(270 + shiftAngle) % 360}deg, 100%, 50%, 0.5)`);
      waveGradient.addColorStop(1, `hsla(${(0 + shiftAngle) % 360}deg, 100%, 50%, 0.5)`);

      shiftAngle += 0.5;
      if (shiftAngle > 360) shiftAngle = 0;

      analyser.getByteFrequencyData(data);
      const a = normalizeData([...data]);
      a.splice(0, (data.length / 8) * 3);
      a.splice((data.length / -8) * 3, (data.length / 8) * 3);

      drawCircularWave(canvas, a, waveGradient, {
        centerHoleRadiusRatio: 0.5,
        maxRadiusRatio: 1,
        clearCanvas: true,
        strokeWidth: 0.5,
        strokeColor: '#fff',
      });

      drawCircularBars(canvas, a, `#fff`, {
        centerHoleRadiusRatio: 0.6,
        maxRadiusRatio: 0.9,
        clearCanvas: false,
        lineCap: 'round',
        mode: 'destination-over',
        gapRatio: 1 / 5,
        drawMode: 'hole',
      });
    };

    requestAnimationFrame(loopingFunction);
  }

  private _playOrPause() {
    if (this.audio.readyState >= 2) {
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
    'play-wave': PlayWave;
  }
}
