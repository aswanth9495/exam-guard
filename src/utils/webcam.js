import webcamHtml from '../templates/webcam.html';
import resizeImage from './image';

export function getVideoElement() {
  const videoElement = document.getElementById('webcam');
  return videoElement;
}

export function captureSnapshot({
  onSnapshotSuccess,
  onSnapshotFailure,
  resizeDimensions,
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
    resizeImage(imageSrc, resizeDimensions)
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
  onSnapshotSuccess, onSnapshotFailure, frequency, resizeDimensions,
}) {
  setInterval(() => {
    captureSnapshot({ onSnapshotSuccess, onSnapshotFailure, resizeDimensions });
  }, frequency);
}

export function setupWebcam() {
  const webcamEl = document.getElementById('webcam-wrapper');
  if (webcamEl) return;
  const webcamContainer = document.createElement('div');
  document.body.appendChild(webcamContainer);

  // Create Webcam component
  const webcamElement = document.createElement('div');
  webcamElement.innerHTML = webcamHtml;
  webcamContainer.appendChild(webcamElement);
}

// Determines if a pixel is considered black (low RGB values)
function isBlackPixel(r, g, b) {
  return r < 10 && g < 10 && b < 10;
}

// Counts the number of black pixels in the frame
function countBlackPixels(frameData) {
  let blackPixelCount = 0;

  for (let i = 0; i < frameData.length; i += 4) {
    const r = frameData[i];
    const g = frameData[i + 1];
    const b = frameData[i + 2];

    if (isBlackPixel(r, g, b)) {
      blackPixelCount += 1;
    }
  }

  return blackPixelCount;
}

// Checks if the frame has a sufficient percentage of black pixels
function isMostlyBlackFrame(frameData, threshold) {
  const blackPixelCount = countBlackPixels(frameData);
  const totalPixels = frameData.length / 4;
  const blackPixelRatio = blackPixelCount / totalPixels;

  return blackPixelRatio >= threshold;
}

// Function to check for black frames
function checkForBlackFrame(
  videoElement,
  stream,
  blackPixelThreshold,
  onWebcamEnabled,
  onWebcamDisabled,
) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const checkBlackFrame = () => {
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const frame = context.getImageData(0, 0, canvas.width, canvas.height).data;

    if (isMostlyBlackFrame(frame, blackPixelThreshold)) {
      onWebcamDisabled?.({ error: new Error('Mostly black video feed detected') });
      videoElement.pause();
      // eslint-disable-next-line no-param-reassign
      videoElement.srcObject = null;
      stream.getTracks().forEach((track) => track.stop());
    } else {
      onWebcamEnabled?.({ videoElement });
    }
  };

  setTimeout(checkBlackFrame, 1000); // Delay to allow video to start
}

// Detect webcam and set up the stream
export function detectWebcam({
  onWebcamEnabled,
  onWebcamDisabled,
  optional,
  blackPixelThreshold = 0.8, // 80% of the video should not be black
}) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      const videoElement = getVideoElement();
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          checkForBlackFrame(
            videoElement,
            stream,
            blackPixelThreshold,
            onWebcamEnabled,
            onWebcamDisabled,
          );
        };
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
