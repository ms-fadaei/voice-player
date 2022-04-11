import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('telegram-voice-player')
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    #container {
      width: 268px;
      height: 62px;
      background: #212145;
      border-radius: 12px;
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
      padding: 15px;
      color: #fff;
    }

    #play > .play-icon {
      position: relative;
      right: -1px;
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
    }
  `;

  @property({ type: Boolean, attribute: false })
  isPlaying = false;

  @property({ type: String })
  src = '';

  override render() {
    return html`
      <div id="container">
        <button id="play" @click=${() => (this.isPlaying = !this.isPlaying)}>
          ${this.isPlaying
            ? html`
                <svg viewBox="0 0 320 512" class="pause-icon">
                  <path
                    fill="currentColor"
                    d="M272 63.1l-32 0c-26.51 0-48 21.49-48 47.1v288c0 26.51 21.49 48 48 48L272 448c26.51 0 48-21.49 48-48v-288C320 85.49 298.5 63.1 272 63.1zM80 63.1l-32 0c-26.51 0-48 21.49-48 48v288C0 426.5 21.49 448 48 448l32 0c26.51 0 48-21.49 48-48v-288C128 85.49 106.5 63.1 80 63.1z"
                  />
                </svg>
              `
            : html`
                <svg viewBox="0 0 384 512" class="play-icon">
                  <path
                    fill="currentColor"
                    d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"
                  />
                </svg>
              `}
        </button>
        <div id="details">
          <canvas id="canvas"></canvas>
          <div id="info">
            <span>03:24</span>
          </div>
        </div>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    const visualizeAudio = (url: string) => {
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => visualize(audioBuffer));
    };

    const filterData = (audioBuffer: AudioBuffer) => {
      const rawData = audioBuffer.getChannelData(0);
      const samples = 50;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        filteredData.push(Math.abs(rawData[i * blockSize]));
      }

      return filteredData;
    };

    const normalizeData = (data: number[]) => {
      const multiplier = Math.pow(Math.max(...data), -1);
      return data.map((d) => d * multiplier);
    };

    const visualize = (audioBuffer: AudioBuffer) => {
      const filteredData = filterData(audioBuffer);
      const normalizedData = normalizeData(filteredData);
      draw(normalizedData);
    };

    const draw = async (data: number[]) => {
      const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth / data.length;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.scale(dpr, dpr);
      ctx.translate(0, canvas.offsetHeight / 2);

      for (let i = 0; i < data.length; i++) {
        const x = width * i;
        let height = data[i] * canvas.offsetHeight;
        if (height < 0) {
          height = 0;
        } else if (height + width / 2 > canvas.offsetHeight) {
          height = canvas.offsetHeight - width / 2;
        }
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            drawLineSegment(ctx, x, height, width, 1 / 3);
            resolve(true);
          });
        });
      }

      handleProgressChange(canvas, ctx);
    };

    const drawLineSegment = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, gapRatio: number) => {
      const bodyRatio = 1 - gapRatio;
      ctx.fillStyle = '#5b5c88';
      ctx.fillRect(x, y / -2, width * bodyRatio, y);
      ctx.beginPath();
      ctx.arc(x + (width * bodyRatio) / 2, y / 2, (width * bodyRatio) / 2, 0, Math.PI * 2);
      ctx.arc(x + (width * bodyRatio) / 2, y / -2, (width * bodyRatio) / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawProgress = (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = '#5b5c88';
      ctx.fillRect(0, height / -2, width, height);

      ctx.fillStyle = '#5562ff';
      ctx.fillRect(0, height / -2, (width * progress) / 100, height);
    };

    const handleProgressChange = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      let isLbPressed = false;
      // eslint-disable-next-line prettier/prettier
      canvas.addEventListener(
        'mousedown',
        (e) =>
          (isLbPressed = true) &&
          drawProgress(ctx, canvas.offsetWidth, canvas.offsetHeight, (e.offsetX / canvas.offsetWidth) * 100)
      );
      canvas.addEventListener('mouseup', () => (isLbPressed = false));
      // eslint-disable-next-line prettier/prettier
      canvas.addEventListener(
        'mousemove',
        (e) =>
          isLbPressed &&
          drawProgress(ctx, canvas.offsetWidth, canvas.offsetHeight, (e.offsetX / canvas.offsetWidth) * 100)
      );
    };

    visualizeAudio(this.src);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'telegram-voice-player': MyElement;
  }
}
