import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { normalizeData } from '~/utils/audio';
import { getCssCustomVariable } from '~/utils/style';
import { setupCanvas, drawCircularWave, drawCircularBars } from '~/utils/draw';
import { DrawCircularBarsMode } from '~/types';
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

      --play-btn-background: #fff;
      --play-btn-color: #1566a3;
      --wave-bg-color: #b7d9f3;
      --wave-border-color: #fff;
      --wave-bar-color: #fff;
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
  @property({ type: Number, reflect: true }) barCenterHoleRadiusRatio = 0.6;
  @property({ type: Number, reflect: true }) barMaxRadiusRatio = 0.9;
  @property({ type: Number, reflect: true }) barGapRatio = 1 / 5;
  @property({ type: String, reflect: true }) barMode = 'hole';
  @property({ type: Boolean, attribute: false }) initiated = false;
  @property({ type: Boolean, attribute: false }) isPlaying = false;
  @property({ type: Boolean, attribute: false }) isPending = true;
  @property({ type: Boolean, attribute: false }) hasLoaded = false;
  @property({ type: Boolean, attribute: false }) hasError = false;
  @property({ attribute: false }) audio = new Audio();

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

  override firstUpdated() {
    this._loadAudio();
  }

  override updated(changed: Map<string, unknown>) {
    if (!this.initiated) return;

    if (changed.has('src')) {
      this._loadAudio();
    }
  }

  private _loadAudio() {
    fetch(this.src).then(() => this._setupAudio());
  }

  private _setupAudio() {
    this.audio = new Audio();
    const drawTheCircularWave = this._setupAudioAnalyser();
    this.audio.src = this.src;
    this.audio.autoplay = false;
    this.audio.loop = false;
    let drawTheCircularWaveRunner: null | number = null;

    this.audio.addEventListener('loadeddata', () => {
      if (this.audio.readyState >= 2) {
        this.isPending = false;
        this.hasLoaded = true;
        this.hasError = false;
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.isPlaying) {
        this.isPlaying = false;
      }
    });

    this.audio.addEventListener('error', () => {
      this.hasLoaded = false;
      this.isPending = false;
      this.hasError = true;
    });

    this.audio.addEventListener('play', () => {
      const drawCycleCb = () => {
        if (drawTheCircularWaveRunner) {
          drawTheCircularWave();
          drawTheCircularWaveRunner = requestAnimationFrame(drawCycleCb);
        }
      };

      drawTheCircularWaveRunner = requestAnimationFrame(drawCycleCb);
    });

    this.audio.addEventListener('pause', () => {
      if (drawTheCircularWaveRunner) {
        cancelAnimationFrame(drawTheCircularWaveRunner);
      }
    });
  }

  private _setupAudioAnalyser(): () => void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const analyser = new AnalyserNode(audioCtx, {
      fftSize: 512,
    });
    const source = audioCtx.createMediaElementSource(this.audio);
    source.connect(analyser);
    source.connect(audioCtx.destination);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    if (!this.initiated) {
      setupCanvas(canvas);
      this.initiated = true;
    }

    const waveBgColor = getCssCustomVariable(this.renderRoot, 'wave-bg-color');
    const waveBorderColor = getCssCustomVariable(this.renderRoot, 'wave-border-color');
    const waveBarColor = getCssCustomVariable(this.renderRoot, 'wave-bar-color');

    const drawTheCircularWave = () => {
      analyser.getByteFrequencyData(data);
      const normalizedData = normalizeData([...data]);
      normalizedData.splice(0, (data.length / 8) * 3);
      normalizedData.splice((data.length / -8) * 3, (data.length / 8) * 3);

      drawCircularWave(canvas, normalizedData, waveBgColor, {
        centerHoleRadiusRatio: 0.5,
        maxRadiusRatio: 1,
        clearCanvas: true,
        strokeWidth: 0.5,
        strokeColor: waveBorderColor,
      });

      drawCircularBars(canvas, normalizedData, waveBarColor, {
        centerHoleRadiusRatio: this.barCenterHoleRadiusRatio,
        maxRadiusRatio: this.barMaxRadiusRatio,
        clearCanvas: false,
        lineCap: 'round',
        mode: 'destination-over',
        gapRatio: this.barGapRatio,
        drawMode: this.barMode as DrawCircularBarsMode,
      });
    };

    return drawTheCircularWave;
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
