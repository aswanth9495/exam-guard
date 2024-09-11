import webcamHtml from '../templates/webcam.html';
import webcamBlocker from '../templates/webcam_blocker.html';
import resizeImage from './image';
import { DEFAULT_SNAPSHOT_RESIZE_OPTIONS } from './constants';

export function getVideoElement() {
  const videoElement = document.getElementById('webcam');
  return videoElement;
}

export function captureSnapshot({
  onSnapshotSuccess,
  onSnapshotFailure,
}) {
  const videoElement = getVideoElement();

  if (videoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageSrc = canvas.toDataURL('image/png');

    // Resize image using ImageUtils
    resizeImage(imageSrc, DEFAULT_SNAPSHOT_RESIZE_OPTIONS)
      .then((blob) => {
        onSnapshotSuccess?.({ blob });
      })
      .catch((error) => {
        onSnapshotFailure?.({ error });
      });
  }
}

// Start taking Snapshots at regular intervals
export function setupSnapshotCapture({
  onSnapshotSuccess, onSnapshotFailure, frequency,
}) {
  setInterval(() => {
    captureSnapshot({ onSnapshotSuccess, onSnapshotFailure });
  }, frequency);
}

export function setupWebcam() {
  const webcamContainer = document.createElement('div');
  document.body.appendChild(webcamContainer);

  // Create Webcam component
  const webcamElement = document.createElement('div');
  webcamElement.innerHTML = webcamHtml;
  webcamContainer.appendChild(webcamElement);
}

// Detect webcam and set up the stream
export function detectWebcam({
  onWebcamEnabled,
  onWebcamDisabled,
  optional,
}) {
  console.log('%c⧭', 'color: #0088cc', 'hello');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      const videoElement = getVideoElement();
      if (videoElement) {
        videoElement.srcObject = stream;
        onWebcamEnabled?.({ videoElement });
      }
    })
    .catch((error) => {
      if (optional) {
        if (error.name !== 'NotFoundError') onWebcamDisabled?.({ error });
      } else {
        onWebcamDisabled?.({ error });
      }
    });
}

export function showWebcamBlocker() {
  const webcamBlockerContainer = document.createElement('div');
  webcamBlockerContainer.innerHTML = webcamBlocker;
  document.body.appendChild(webcamBlockerContainer);
}

export function disableWebcamBlocker() {
  const webcamBlockerEl = document.getElementById('webcam-blocker');
  if (webcamBlockerEl) {
    webcamBlockerEl.remove();
  }
}