import { filterData, normalizeData } from '~/utils/audio';

export function setupCanvas(canvas: HTMLCanvasElement) {
  // set dpr
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;

  // config context
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(dpr, dpr);
  ctx.save();
}

export async function drawBars(
  canvas: HTMLCanvasElement,
  audioBuffer: AudioBuffer,
  count: number,
  gapRatio: number,
  color: string,
  mirrored = false
) {
  const filteredData = filterData(audioBuffer, count);
  const normalizedData = normalizeData(filteredData);

  // calculate bars width
  let totalWidth = canvas.offsetWidth / count;
  const gapWidth = totalWidth * gapRatio;
  const bodyWidth = totalWidth - gapWidth;
  totalWidth += gapWidth / count;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.translate(0, mirrored ? canvas.offsetHeight / 2 : canvas.offsetHeight);

  for (let i = 0; i < count; i++) {
    const x = totalWidth * i;
    const maxHeight = mirrored ? canvas.offsetHeight / 2 : canvas.offsetHeight;
    let height = normalizedData[i] * canvas.offsetHeight;
    if (mirrored) height /= 2;

    if (height < 0) {
      height = 0;
    } else if (height + bodyWidth / 2 > maxHeight) {
      height = maxHeight - bodyWidth / 2;
    }

    await asyncRequestAnimationFrame();

    // draw
    ctx.fillStyle = color;
    ctx.fillRect(x, height * -1, bodyWidth, mirrored ? height * 2 : height);
    ctx.beginPath();
    ctx.arc(x + bodyWidth / 2, height * -1, bodyWidth / 2, 0, Math.PI * 2);
    if (mirrored) ctx.arc(x + bodyWidth / 2, height, bodyWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function asyncRequestAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(true);
    });
  });
}
