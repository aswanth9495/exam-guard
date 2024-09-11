import html2canvas from 'html2canvas';
import resizeImage from './image';
import { DEFAULT_SCREENSHOT_RESIZE_OPTIONS } from './constants';

// Capture Screenshot
export function captureScreenshot({
  onScreenshotSuccess,
  onScreenshotFailure,
}) {
  html2canvas(document.body, { logging: false })
    .then((canvas) => {
      const imageSrc = canvas.toDataURL('image/png');

      resizeImage(imageSrc, DEFAULT_SCREENSHOT_RESIZE_OPTIONS)
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
}) {
  setInterval(() => {
    captureScreenshot({ onScreenshotSuccess, onScreenshotFailure });
  }, frequency);
}

export function setupScreenshot({
  onScreenshotEnabled,
  onScreenshotDisabled,
  onScreenshotSuccess,
  onScreenshotFailure,
  frequency,
}) {
  try {
    onScreenshotEnabled?.();
    startScreenshotCapture({
      onScreenshotSuccess,
      onScreenshotFailure,
      frequency,
    });
  } catch (error) {
    onScreenshotDisabled?.();
  }
}
