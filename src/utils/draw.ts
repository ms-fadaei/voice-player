export function setupCanvas(canvas: HTMLCanvasElement) {
  // set dpr
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;

  // config context
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.scale(dpr, dpr);
}

export function drawCurvedPolygon(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  const count = points.length;

  // move to before first point
  ctx.moveTo((points[count - 1].x + points[0].x) / 2, (points[count - 1].y + points[0].y) / 2);

  for (let i = 0; i < count; i++) {
    const newX = (points[i].x + points[(i + 1) % count].x) / 2;
    const newY = (points[i].y + points[(i + 1) % count].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, newX, newY);
  }
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

let radial = 0;

export async function drawCircularWave(canvas: HTMLCanvasElement, data: number[]) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();

  const temp = [...data];
  const filteredData = temp;
  const count = filteredData.length;
  if (count === 0) return;

  const maxHeight = canvas.offsetHeight / 2;
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);

  const gradient = ctx.createConicGradient(0, 0, 0);

  // Add five color stops
  gradient.addColorStop(0, `hsla(${(0 + radial) % 360}, 100%, 50%, 0.5)`);
  gradient.addColorStop(0.2, `hsla(${(60 + radial) % 360}, 100%, 50%, 0.5)`);
  gradient.addColorStop(0.4, `hsla(${(120 + radial) % 360}, 100%, 50%, 0.5)`);
  gradient.addColorStop(0.6, `hsla(${(180 + radial) % 360}, 100%, 50%, 0.5)`);
  gradient.addColorStop(0.8, `hsla(${(240 + radial) % 360}, 100%, 50%, 0.5)`);
  gradient.addColorStop(1, `hsla(${(0 + radial) % 360}, 100%, 50%, 0.5)`);

  radial += 0.25;
  if (radial > 360) radial = 0;

  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#fff8';
  ctx.lineWidth = 0.25;

  const centerHoleRadius = 0.55;
  let maxRadius = 0.75;
  let rangeScale = maxRadius / (maxRadius - centerHoleRadius);

  ctx.beginPath();
  drawCurvedPolygon(ctx, getPolygonPoints(filteredData, maxHeight, rangeScale, centerHoleRadius, 0));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  maxRadius = 1;
  rangeScale = maxRadius / (maxRadius - centerHoleRadius);

  ctx.globalCompositeOperation = 'destination-over';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  getPolygonPoints(filteredData, maxHeight, rangeScale, centerHoleRadius, Math.PI).forEach((value) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(value.x, value.y);
    ctx.stroke();
  });

  ctx.restore();
}

/* utils */
function getPolygonPoints(data: number[], radius: number, rangeScale = 1, centerHoleRadius = 0, degreeShift = 0) {
  const count = data.length;
  return data.map((d, i) => {
    const hypotenuse = (d / rangeScale + centerHoleRadius) * radius;
    const angle = (2 * Math.PI * i) / count + degreeShift;
    const x = Math.cos(angle) * hypotenuse;
    const y = Math.sin(angle) * hypotenuse;

    return { x, y };
  });
}

function asyncRequestAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(true);
    });
  });
}
