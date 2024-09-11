import html2canvas from 'html2canvas';
import resizeImage from './image';

// Capture Screenshot
export function captureScreenshot({
  onScreenshotSuccess,
  onScreenshotFailure,
  resizeDimensions,
}) {
  html2canvas(document.body, { logging: false })
    .then((canvas) => {
      const imageSrc = canvas.toDataURL('image/png');

      resizeImage(imageSrc, resizeDimensions)
        .then((blob) => {
          onScreenshotSuccess?.({ blob });
        })
        .catch((err) => {
          onScreenshotFailure?.({ err });
        });
    })
    .catch((error) => {
      onScreenshotFailure?.({ error });
    });
}

function startScreenshotCapture({
  onScreenshotSuccess,
  onScreenshotFailure,
  frequency,
  resizeDimensions,
}) {
  setInterval(() => {
    captureScreenshot({ onScreenshotSuccess, onScreenshotFailure, resizeDimensions });
  }, frequency);
}

export function setupScreenshot({
  onScreenshotEnabled,
  onScreenshotDisabled,
  onScreenshotSuccess,
  onScreenshotFailure,
  frequency,
  resizeDimensions,
}) {
  try {
    onScreenshotEnabled?.();
    startScreenshotCapture({
      onScreenshotSuccess,
      onScreenshotFailure,
      frequency,
      resizeDimensions,
    });
  } catch (error) {
    onScreenshotDisabled?.();
  }
}
