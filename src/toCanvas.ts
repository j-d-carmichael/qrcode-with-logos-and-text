import { renderQrCode } from "./draw-canvas";
import { BaseOptions } from "./model";
import { drawLogo } from "./draw-logo";

export const toCanvas = (options: BaseOptions): Promise<void> => {
  return renderQrCode(options).then(() => drawLogo(options));
};
