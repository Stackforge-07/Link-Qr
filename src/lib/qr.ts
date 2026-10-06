import QRCode from "qrcode";

/**
 * Generate a QR code as a data URL (PNG base64).
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}

/**
 * Generate a QR code as an SVG string.
 */
export async function generateQrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    width: 400,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}
