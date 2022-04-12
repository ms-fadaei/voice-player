export function setupCanvas(canvas: HTMLCanvasElement) {
  // set dpr
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;

  // config context
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(dpr, dpr);
}

interface DrawBarsOptions {
  async?: boolean;
  mirror?: boolean;
  round?: boolean;
  minHeight?: number;
}

export async function drawBars(
  canvas: HTMLCanvasElement,
  data: number[],
  gapRatio: number,
  color: string,
  { async = true, mirror = false, round = true, minHeight = 0 }: DrawBarsOptions = {}
) {
  const count = data.length;
  // calculate bars width
  let totalWidth = canvas.offsetWidth / count;
  const gapWidth = totalWidth * gapRatio;
  const bodyWidth = totalWidth - gapWidth;
  totalWidth += gapWidth / count;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();
  ctx.translate(0, mirror ? canvas.offsetHeight / 2 : canvas.offsetHeight);

  for (let i = 0; i < count; i++) {
    const x = totalWidth * i;
    const maxHeight = mirror ? canvas.offsetHeight / 2 : canvas.offsetHeight;
    let height = data[i] * canvas.offsetHeight;
    if (mirror) height /= 2;

    if (height < minHeight * maxHeight) height = minHeight * maxHeight;
    else if (round && height + bodyWidth / 2 > maxHeight) height = maxHeight - bodyWidth / 2;
    else if (height > maxHeight) height = maxHeight;

    if (async) await asyncRequestAnimationFrame();

    // draw
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.clearRect(x, maxHeight * -1, totalWidth, mirror ? maxHeight * 2 : maxHeight);
    ctx.fillRect(x, height * -1, bodyWidth, mirror ? height * 2 : height);
    if (round) {
      ctx.beginPath();
      ctx.arc(x + bodyWidth / 2, height * -1, bodyWidth / 2, 0, Math.PI * 2);
      if (mirror) ctx.arc(x + bodyWidth / 2, height, bodyWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
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
