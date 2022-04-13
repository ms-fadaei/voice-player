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

const randomIndex = Array.from({ length: 32 }, (_, i) => i).sort(() => Math.random() - 0.5);

export async function drawCircularWave(canvas: HTMLCanvasElement, data: number[]) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();

  // const newData: number[] = [];
  // data.forEach((value, i) => {
  //   newData[randomIndex[i]] = value;
  // });

  const newData = [...data.reverse(), ...data.reverse()];
  const count = newData.length;

  if (count === 0) return;

  const maxHeight = canvas.offsetHeight / 2;
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
  ctx.fillStyle = '#fff5';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 0.25;

  const reserveRadius = 0.5;
  const power = 1 / (1 - reserveRadius);

  let cords = newData.map((d, i) => {
    const c = (d / power + reserveRadius) * maxHeight;
    const r = (2 * Math.PI * i) / count;
    const x = Math.cos(r) * c;
    const y = Math.sin(r) * c;

    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(cords[0].x, cords[0].y);
  console.log(cords[0]);

  for (let i = 1; i < count - 2; i++) {
    const xc = (cords[i].x + cords[i + 1].x) / 2;
    const yc = (cords[i].y + cords[i + 1].y) / 2;
    ctx.quadraticCurveTo(cords[i].x, cords[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(cords[count - 1].x, cords[count - 1].y, cords[0].x, cords[0].y);
  ctx.fill();
  ctx.stroke();

  cords = newData.map((d, i) => {
    const c = (d / power + reserveRadius) * maxHeight;
    const r = (2 * Math.PI * i) / count + (Math.PI * 2) / 3;
    const x = Math.cos(r) * c;
    const y = Math.sin(r) * c;

    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(cords[0].x, cords[0].y);

  for (let i = 1; i < count - 2; i++) {
    const xc = (cords[i].x + cords[i + 1].x) / 2;
    const yc = (cords[i].y + cords[i + 1].y) / 2;
    ctx.quadraticCurveTo(cords[i].x, cords[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(cords[0].x, cords[0].y, cords[1].x, cords[1].y);
  ctx.fill();
  ctx.stroke();

  cords = newData.map((d, i) => {
    const c = (d / power + reserveRadius) * maxHeight;
    const r = (2 * Math.PI * i) / count + (Math.PI * 4) / 3;
    const x = Math.cos(r) * c;
    const y = Math.sin(r) * c;

    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(cords[0].x, cords[0].y);

  for (let i = 1; i < count - 2; i++) {
    const xc = (cords[i].x + cords[i + 1].x) / 2;
    const yc = (cords[i].y + cords[i + 1].y) / 2;
    ctx.quadraticCurveTo(cords[i].x, cords[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(cords[0].x, cords[0].y, cords[1].x, cords[1].y);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function asyncRequestAnimationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(true);
    });
  });
}
