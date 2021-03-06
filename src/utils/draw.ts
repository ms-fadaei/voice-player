import { CanvasStyle, DrawCircularBarsMode } from '~/types';

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
  lineCap?: CanvasLineCap;
}

export async function drawBars(
  canvas: HTMLCanvasElement,
  data: number[],
  gapRatio: number,
  color: CanvasStyle,
  { async = true, mirror = false, lineCap = 'round', minHeight = 0 }: DrawBarsOptions = {}
) {
  const count = data.length;
  // calculate bars width
  let totalWidth = canvas.offsetWidth / count;
  const gapWidth = totalWidth * gapRatio;
  const bodyWidth = totalWidth - gapWidth;
  totalWidth += gapWidth / count;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();
  ctx.translate(0, mirror ? canvas.offsetHeight / 2 : canvas.offsetHeight - bodyWidth);

  for (let i = 0; i < count; i++) {
    const x = totalWidth * i;
    const maxHeight = mirror ? canvas.offsetHeight / 2 : canvas.offsetHeight - bodyWidth;
    let height = data[i] * canvas.offsetHeight;
    if (mirror) height /= 2;

    if (height < minHeight * maxHeight) height = minHeight * maxHeight;
    else if (height + bodyWidth > maxHeight) height = maxHeight - bodyWidth;
    else if (height > maxHeight) height = maxHeight;

    if (async) await asyncRequestAnimationFrame();

    // draw
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(x, maxHeight * -1, totalWidth, mirror ? maxHeight * 2 : maxHeight + bodyWidth);

    ctx.strokeStyle = color;
    ctx.lineWidth = bodyWidth;
    ctx.lineCap = lineCap;

    ctx.beginPath();
    ctx.moveTo(x + bodyWidth / 2, height * -1);
    ctx.lineTo(x + bodyWidth / 2, mirror ? height : 0);
    ctx.stroke();
    ctx.closePath();
  }

  ctx.restore();
}

interface DrawCircularWaveOption {
  centerHoleRadiusRatio?: number;
  maxRadiusRatio?: number;
  mode?: GlobalCompositeOperation;
  clearCanvas?: boolean;
  strokeWidth?: number;
  strokeColor?: CanvasStyle;
  rotate?: number;
}

export async function drawCircularWave(
  canvas: HTMLCanvasElement,
  data: number[],
  color: CanvasStyle,
  {
    centerHoleRadiusRatio = 0,
    maxRadiusRatio = 1,
    mode = 'source-over',
    clearCanvas = true,
    strokeWidth = 0,
    strokeColor = '',
    rotate = 0,
  }: DrawCircularWaveOption = {}
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();

  const rangeScale = maxRadiusRatio / (maxRadiusRatio - centerHoleRadiusRatio);

  const maxHeight = canvas.offsetHeight / 2;
  if (clearCanvas) ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);

  ctx.fillStyle = color;
  if (strokeWidth !== 0) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
  }

  ctx.globalCompositeOperation = mode;
  ctx.beginPath();
  drawCurvedPolygon(ctx, getPolygonPoints(data, maxHeight, rangeScale, centerHoleRadiusRatio, rotate));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

interface DrawCircularBarsOption {
  centerHoleRadiusRatio?: number;
  maxRadiusRatio?: number;
  mode?: GlobalCompositeOperation;
  clearCanvas?: boolean;
  rotate?: number;
  lineCap?: CanvasLineCap;
  gapRatio?: number;
  drawMode?: DrawCircularBarsMode;
}

export async function drawCircularBars(
  canvas: HTMLCanvasElement,
  data: number[],
  color: CanvasStyle,
  {
    centerHoleRadiusRatio = 0,
    maxRadiusRatio = 1,
    mode = 'source-over',
    clearCanvas = true,
    rotate = 0,
    lineCap = 'round',
    gapRatio = 0,
    drawMode = 'full',
  }: DrawCircularBarsOption = {}
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();

  const maxHeight = canvas.offsetHeight / 2;
  if (clearCanvas) ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);

  const rangeScale = maxRadiusRatio / (maxRadiusRatio - centerHoleRadiusRatio);
  const holeCirclePerimeter = centerHoleRadiusRatio * maxHeight * Math.PI * 2;

  ctx.globalCompositeOperation = mode;
  ctx.strokeStyle = color;
  ctx.lineWidth = (holeCirclePerimeter / data.length) * (1 - gapRatio);
  ctx.lineCap = lineCap;

  ctx.beginPath();
  const points = getPolygonPoints(data, maxHeight, rangeScale, centerHoleRadiusRatio, rotate);
  const angleTimes = (2 * Math.PI) / data.length;
  points.forEach((value, i) => {
    if (drawMode === 'hole') {
      const hypotenuse = centerHoleRadiusRatio * maxHeight;
      const angle = i * angleTimes + rotate;
      const x = Math.cos(angle) * hypotenuse;
      const y = Math.sin(angle) * hypotenuse;
      ctx.moveTo(x, y);
    } else if (drawMode === 'dynamic') {
      ctx.moveTo(value.x * centerHoleRadiusRatio, value.y * centerHoleRadiusRatio);
    } else {
      ctx.moveTo(0, 0);
    }

    ctx.lineTo(value.x, value.y);
  });
  ctx.stroke();

  ctx.restore();
}

/* utils */
function getPolygonPoints(data: number[], radius: number, rangeScale = 1, centerHoleRadiusRatio = 0, degreeShift = 0) {
  const angleTimes = (2 * Math.PI) / data.length;
  return data.map((d, i) => {
    const hypotenuse = (d / rangeScale + centerHoleRadiusRatio) * radius;
    const angle = i * angleTimes + degreeShift;
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
