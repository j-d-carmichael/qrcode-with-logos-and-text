import { BaseOptions, Logo } from './model';
import { isString } from './utils';

export const drawLogo = ({ canvas, logo, text }: BaseOptions): Promise<void> => {

  if (!logo) return Promise.resolve();

  if (logo === '') return Promise.resolve();

  const canvasWidth = canvas!.width;
  const canvasHeight = canvas!.height;

  if (isString(logo)) {
    logo = { src: logo } as Logo;
  }

  const {
    logoSize = 0.15,
    borderColor = '#ffffff',
    bgColor = borderColor || '#ffffff',
    borderSize = 0.05,
    crossOrigin,
    borderRadius = 8,
    logoRadius = 0
  } = logo as Logo;

  let logoSrc = typeof logo === 'string' ? logo : logo.src;
  let logoWidth = canvasWidth * logoSize;
  let logoXY = (canvasWidth * (1 - logoSize)) / 2;
  let logoBgWidth = canvasWidth * (logoSize + borderSize);
  let logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2;

  const ctx = canvas!.getContext('2d') as CanvasRenderingContext2D;

  // logo draw logo background color
  canvasRoundRect(ctx)(
    logoBgXY,
    logoBgXY,
    logoBgWidth,
    logoBgWidth,
    borderRadius
  );
  ctx.fillStyle = bgColor;
  ctx.fill();

  // logo
  const image = new Image();
  image.setAttribute('crossOrigin', crossOrigin || 'anonymous');
  image.src = logoSrc;

  // Use image drawing to avoid some cross-domain situations
  const drawLogoWithImage = (image: HTMLImageElement) => {
    ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
  };

  // Use canvas to draw more features, such as borderRadius
  const drawLogoWithCanvas = (image: HTMLImageElement) => {
    const canvasImage = document.createElement('canvas');

    canvasImage.width = logoXY + logoWidth;
    canvasImage.height = logoXY + logoWidth;
    canvasImage
      .getContext('2d')!
      .drawImage(image, logoXY, logoXY, logoWidth, logoWidth);

    canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius);
    // @ts-ignore
    ctx.fillStyle = ctx.createPattern(canvasImage, 'no-repeat');
    ctx.fill();
  };

  // Draw the logo on the canvas
  return new Promise((resolve, reject) => {
    image.onload = () => {
      logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image);

      // Draw the text below the QR code if text is provided
      if (text) {
        const offset = text.positionOffset || 10;
        ctx.font = text.font || '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = text.colorHexCode || '#000000';
        ctx.fillText(text.text, canvasWidth / 2, canvasHeight - offset);
      }

      resolve();
    };
    image.onerror = () => {
      reject('logo load fail!');
    };
  });
};

// draw radius
const canvasRoundRect = (ctx: CanvasRenderingContext2D) => (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const minSize = Math.min(w, h);
  if (r > minSize / 2) {
    r = minSize / 2;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
};
