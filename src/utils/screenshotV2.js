const ENTIRE_SCREEN_DISPLAY_SURFACE = 'monitor';
const SCREEN_SHARE_READY_STATE = 'live';
const ERRORS = {
  FULL_MONITOR_NOT_SHARED: 'FULL_MONITOR_NOT_SHARED',
  SCREEN_SHARE_STREAM_ENDED: 'SCREEN_SHARE_STREAM_ENDED',
  SCREEN_SHARE_FAILED: 'SCREEN_SHARE_FAILED',
  SCREEN_SHARE_DENIED: 'SCREEN_SHARE_DENIED',
};

class ScreenShareMonitor {
  constructor() {
    this.captureInterval = null;
    this.mediaStream = null;
  }

  async requestScreenShare({ onSuccess, onFailure, onEnd }) {
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' },
      });
      this.listenScreenShareEnd({ onEnd });
      onSuccess?.({ stream: this.mediaStream });

      return true;
    } catch (err) {
      console.error('Screen sharing was denied or failed:', err);
      onFailure?.({ err });
      return false;
    }
  }

  async isScreenShareValid() {
    if (!this.mediaStream) return [false, ERRORS.SCREEN_SHARE_DENIED];

    const videoTracks = this.mediaStream.getVideoTracks();
    if (videoTracks.length === 0) return [false, ERRORS.SCREEN_SHARE_FAILED];

    const { readyState } = videoTracks[0];
    if (readyState !== SCREEN_SHARE_READY_STATE) return [false, ERRORS.SCREEN_SHARE_STREAM_ENDED];

    const { displaySurface } = videoTracks[0].getSettings();

    if (displaySurface !== ENTIRE_SCREEN_DISPLAY_SURFACE) {
      this.stopScreenShare();
      return [false, ERRORS.FULL_MONITOR_NOT_SHARED];
    }

    return [true, null];
  }

  async captureScreenshot() {
    // check if video, canvas need to be manually garbage collected!
    const video = document.createElement('video');
    video.srcObject = this.mediaStream;
    video.play();

    await new Promise((resolve) => {
      video.onloadedmetadata = () => resolve();
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => { canvas.toBlob(resolve); });

    return blob;
  }

  startScreenshotCapture({
    onSuccess, onFailure, interval = 3000, maxRetries = 3, baseDelay = 1000,
  }) {
    if (!this.mediaStream) {
      console.warn('No media stream available. Start screen sharing first.');
      return;
    }

    this.captureInterval = setInterval(async () => {
      try {
        const blob = await this.captureScreenshot();

        let attempt = 0;
        let success = false;
        let delay = baseDelay;

        while (attempt < maxRetries && !success) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await onSuccess?.({ blob });
            success = true;
          } catch (err) {
            console.log(err);
            attempt += 1;
            if (attempt === maxRetries) {
              onFailure?.({ err });
            } else {
              console.warn(`Retry attempt ${attempt} failed. Retrying in ${delay}ms.`);
              // eslint-disable-next-line no-await-in-loop, no-loop-func
              await new Promise((resolve) => { setTimeout(resolve, delay); });
              delay *= 2;
            }
          }
        }
      } catch (err) {
        onFailure?.({ err });
      }
    }, interval);
  }

  stopScreenShare() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    clearInterval(this.captureInterval);
  }

  listenScreenShareEnd({ onEnd }) {
    if (!this.mediaStream) return;

    const videoTrack = this.mediaStream.getVideoTracks()[0];
    videoTrack.addEventListener('ended', () => {
      this.stopScreenShare();
      onEnd?.();
    });
  }
}

const screenShareMonitor = new ScreenShareMonitor();

export async function isScreenShareValid({ onSuccess, onFailure }) {
  const [success, error] = await screenShareMonitor.isScreenShareValid();
  if (success) {
    onSuccess?.();
  } else {
    onFailure?.(error);
  }
}

export async function setupScreenshotCaptureFromScreenShare({
  onScreenShareEnabled,
  onScreenShareFailure,
  onScreenShareEnd,
  onScreenshotSuccess,
  onScreenshotFailure,
  frequency,
  resizeDimensions,
}) {
  try {
    const resp = await screenShareMonitor.requestScreenShare({
      onSuccess: onScreenShareEnabled,
      onFailure: onScreenShareFailure,
      onEnd: onScreenShareEnd,
    });

    if (!resp) return;
    if (!screenShareMonitor.isScreenShareValid()) throw Error('Screenshare not valid');

    onScreenShareEnabled?.();

    screenShareMonitor.startScreenshotCapture({
      onSuccess: onScreenshotSuccess,
      onFailure: onScreenshotFailure,
      interval: frequency,
      resizeDimensions,
    });
  } catch (error) {
    onScreenShareFailure?.();
  }
}

export function screenshareCleanup() {
  this.stopScreenShare();
}
