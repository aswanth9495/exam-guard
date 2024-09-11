import webcamHtml from '../templates/webcam.html';
import resizeImage from './image';
import { DEFAULT_SNAPSHOT_RESIZE_OPTIONS } from './constants';

export function captureSnapshot({
  videoElement,
  onSnapshotSucccess,
  onSnapshotFailure,
}) {
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
        onSnapshotSucccess?.({ blob });
      })
      .catch((err) => {
        onSnapshotFailure?.({ err });
      });
  }
}

// Start taking Snapshots at regular intervals
function startSnapshotCapture({
  videoElement, onSnapshotSucccess, onSnapshotFailure, frequency,
}) {
  setInterval(() => {
    captureSnapshot({ videoElement, onSnapshotSucccess, onSnapshotFailure });
  }, frequency);
}

// Capture snapshot logic without using refs

// eslint-disable-next-line import/prefer-default-export
export function setupWebcam({
  onWebcamEnabled,
  onWebcamDisabled,
  onSnapshotSucccess,
  onSnapshotFailure,
  optional,
  frequency,
}) {
  console.log('%c⧭', 'color: #00a3cc', 'hello');
  const webcamContainer = document.createElement('div');
  document.body.appendChild(webcamContainer);

  // Create Webcam component
  const webcamElement = document.createElement('div');
  webcamElement.innerHTML = webcamHtml;
  webcamContainer.appendChild(webcamElement);
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      const videoElement = document.getElementById('webcam');
      videoElement.srcObject = stream;
      onWebcamEnabled?.();
      startSnapshotCapture({
        videoElement, onSnapshotSucccess, onSnapshotFailure, frequency,
      });
    })
    .catch((error) => {
      if (optional) {
        if (error.name !== 'NotFoundError') onWebcamDisabled?.();
      } else {
        onWebcamDisabled?.();
      }
    });
}
