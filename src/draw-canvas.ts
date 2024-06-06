import { BaseOptions, NodeQrCodeOptions } from './model';
import { promisify } from './utils';
import QRCode from 'qrcode';

const toCanvas = promisify(QRCode.toCanvas);

export const renderQrCode = ({
  canvas,
  content,
  width = 0,
  nodeQrCodeOptions = {}
}: BaseOptions) => {
  // according to the content length to choose different errorCorrectionLevel
  nodeQrCodeOptions.errorCorrectionLevel =
    nodeQrCodeOptions.errorCorrectionLevel || getErrorCorrectionLevel(content);

  return getOriginWidth(content, nodeQrCodeOptions).then((_width: number) => {
    // Restore to the set value according to the original ratio, and then zoom in 4 times to get the HD image.
    nodeQrCodeOptions.scale = width === 0 ? undefined : (width / _width) * 4;
    // @ts-ignore
    return toCanvas(canvas, content, nodeQrCodeOptions);
  });
};

// Get the size of the original QrCode
const getOriginWidth = (
  content: string,
  nodeQrCodeOption: NodeQrCodeOptions
) => {
  const _canvas = document.createElement('canvas');
  // @ts-ignore
  return toCanvas(_canvas, content, nodeQrCodeOption).then(() => _canvas.width);
};

// Increase the fault tolerance for QrCode with less content
const getErrorCorrectionLevel = (content: string): string => {
  if (content.length > 36) {
    return 'M';
  } else if (content.length > 16) {
    return 'Q';
  } else {
    return 'H';
  }
};
