export function setupCanvas(canvas: HTMLCanvasElement) {
  // set dpr
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;

  // config context
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(dpr, dpr);
}

export async function drawBars(
  canvas: HTMLCanvasElement,
  data: number[],
  gapRatio: number,
  color: string,
  asyncProgress = true,
  mirrored = false
) {
  const count = data.length;
  // calculate bars width
  let totalWidth = canvas.offsetWidth / count;
  const gapWidth = totalWidth * gapRatio;
  const bodyWidth = totalWidth - gapWidth;
  totalWidth += gapWidth / count;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();
  ctx.translate(0, mirrored ? canvas.offsetHeight / 2 : canvas.offsetHeight);

  for (let i = 0; i < count; i++) {
    const x = totalWidth * i;
    const maxHeight = mirrored ? canvas.offsetHeight / 2 : canvas.offsetHeight;
    let height = data[i] * canvas.offsetHeight;
    if (mirrored) height /= 2;

    if (height < 0) {
      height = 0;
    } else if (height + bodyWidth / 2 > maxHeight) {
      height = maxHeight - bodyWidth / 2;
    }

    if (asyncProgress) await asyncRequestAnimationFrame();

    // draw
    ctx.clearRect(x, maxHeight * -1, totalWidth, mirrored ? maxHeight * 2 : maxHeight);
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
