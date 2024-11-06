const ENTIRE_SCREEN_DISPLAY_SURFACE = "monitor";
const SCREEN_SHARE_READY_STATE = "live";
const ERRORS = {
  FULL_MONITOR_NOT_SHARED: "FULL_MONITOR_NOT_SHARED",
  SCREEN_SHARE_STREAM_ENDED: "SCREEN_SHARE_STREAM_ENDED",
  SCREEN_SHARE_FAILED: "SCREEN_SHARE_FAILED"
};

class ScreenShareMonitor {
  constructor() {
    this.captureInterval = null;
    this.mediaStream = null;
  }

  async requestScreenShare({ onSuccess, onFailure, onEnd }) {
    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({});
      listenScreenShareEnd({ onEnd });
      onSuccess?.({ stream: this.mediaStream });

      return true;
    } catch (err) {
      console.error("Screen sharing was denied or failed:", err);
      onFailure?.({ err });
      return false;
    }
  }

  isScreenShareValid() {
    const videoTracks = this.mediaStream.getVideoTracks();
    if (videoTracks.length === 0) return [false, ERRORS.SCREEN_SHARE_FAILED]

    const { readyState } = videoTracks[0];
    if (readyState !== SCREEN_SHARE_READY_STATE) return [false, ERRORS.SCREEN_SHARE_STREAM_ENDED]

    const { displaySurface } = videoTracks[0].getSettings();

    if (displaySurface !== ENTIRE_SCREEN_DISPLAY_SURFACE) {
      screenStream.getTracks().forEach((track) => track.stop())
      return [false, ERRORS.FULL_MONITOR_NOT_SHARED];
    }

    return [true, null];
  }

  startScreenshotCapture({ onSuccess, onFailure, interval = 3_000 }) {
    if (!this.mediaStream) {
      console.warn("No media stream available. Start screen sharing first.");
      return;
    }

    const videoTrack = this.mediaStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    this.captureInterval = setInterval(async () => {
      try {
        const blob = await imageCapture.takePhoto();
        onSuccess?.({ blob });
      } catch (err) {
        onFailure?.({ err })
      }
    }, interval);
  }

  stopScreenShare() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    clearInterval(this.captureInterval);
  }

  listenScreenShareEnd({ onEnd }) {
    const videoTrack = this.mediaStream.getVideoTracks()[0];
    videoTrack.addEventListener("ended", () => {
      this.stopScreenShare();
      onEnd?.();
    });
  }
}

const screenShareMonitor = new ScreenShareMonitor();

export async function enableScreenSharing({ onSuccess, onFailure, onEnd }) {
  return screenShareMonitor.requestScreenShare({ onSuccess, onFailure, onEnd });
}

export function setupScreenshotCapture({
  onScreenshotEnabled,
  onScreenshotDisabled,
  onScreenshotSuccess,
  onScreenshotFailure,
  frequency,
  resizeDimensions,
}) {
  try {
    onScreenshotEnabled?.();
    if (!screenShareMonitor.isScreenShareValid()) throw Error("Screenshare not valid");

    screenShareMonitor.startScreenshotCapture({
      onSuccess: onScreenshotSuccess,
      onFailure: onScreenshotFailure,
      interval: frequency,
    });
  } catch (error) {
    onScreenshotDisabled?.();
  }
}
