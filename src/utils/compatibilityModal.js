import compatibilityModalHtml from '../templates/compatibility_modal.html';
import screenshareButtonHtml from '../templates/screenshare_button.html';
import screenshareInstruction from '../templates/screenshare_instruction.html';
import checkMarkImage from '../assets/images/checkMark.svg';
import failureMark from '../assets/images/failMark.svg';

let countdownInterval = null;

function renderCompatibilityModalHTML(mockModeEnabled) {
  const baseHTML = compatibilityModalHtml;
  let screenshareHTML;
  if (!mockModeEnabled) {
    screenshareHTML = screenshareButtonHtml;
  } else {
    screenshareHTML = screenshareInstruction;
  }
  return baseHTML.replace('{{ screenshare_html }}', screenshareHTML);
}

export function setIconsForChecks(passedChecks = {}, checks = {}) {
  const camIcon = document.getElementById('webcam-check');
  const fullscreenIcon = document.getElementById('fullscreen-check');
  const fullscreenShareIcon = document.getElementById('screenshare-check');
  const networkIcon = document.getElementById('network-check');
  const webcamPoint = document.getElementById('webcam-point');
  const fullscreenPoint = document.getElementById('fullscreen-point');
  const networkPoint = document.getElementById('network-point');
  camIcon.src = failureMark;
  fullscreenIcon.src = failureMark;
  networkIcon.src = failureMark;
  fullscreenShareIcon.src = failureMark;
  if (passedChecks.webcam) {
    camIcon.src = checkMarkImage;
  }
  if (passedChecks.fullscreen) {
    fullscreenIcon.src = checkMarkImage;
  }
  if (passedChecks.networkSpeed) {
    networkIcon.src = checkMarkImage;
  }
  if (passedChecks.screenshare) {
    fullscreenShareIcon.src = checkMarkImage;
  }
  if (!checks.webcam) {
    webcamPoint.style = 'display: none';
  }
  if (!checks.fullscreen) {
    fullscreenPoint.style = 'display: none';
  }
  if (!checks.networkSpeed) {
    networkPoint.style = 'display: none';
  }
  if (!checks.screenshare) {
    fullscreenShareIcon.src = 'display: none';
  }
}

export function setupCompatibilityCheckModal(onContinueClick, config = {}) {
  if (!config.enable) {
    return;
  }
  const { mockModeEnabled } = config;
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = renderCompatibilityModalHTML(mockModeEnabled);
  document.body.appendChild(modalContainer);

  const continueBtn = document.getElementById('compatibility-continue-test-btn');
  const modalHeading = document.getElementById('compatibility-modal-heading');
  const timerCountElement = document.getElementById('compatibility-modal-timer-count');
  const compatibilityModal = document.getElementById('compatibility-overlay');
  if (config.buttonText) {
    continueBtn.textContent = config.buttonText;
  }

  if (config.headingText) {
    modalHeading.textContent = config.headingText;
  }

  if (timerCountElement) {
    timerCountElement.dataset.timeout = config.disqualificationTimeout / 1000;
  }

  continueBtn.addEventListener('click', () => {
    compatibilityModal.style.display = '';
    clearInterval(countdownInterval);
    onContinueClick?.();
  });
}

export function hideCompatibilityModal() {
  const compatibilityModal = document.getElementById('compatibility-overlay');
  if (compatibilityModal) {
    compatibilityModal.style.display = '';
    clearInterval(countdownInterval);
  }
}

function setupTimer(onCountDownEnd) {
  const timerEl = document.getElementById('compatibility-modal-timer');
  const timerCountElement = document.getElementById('compatibility-modal-timer-count');
  const circleAnimation = document.getElementById('compatibility-modal-timer-circle');
  let timerCount = timerCountElement.dataset.timeout;
  if (timerEl) {
    timerEl.style.display = 'flex';
  }
  timerCountElement.textContent = timerCount;
  countdownInterval = setInterval(() => {
    timerCountElement.textContent = timerCount;

    const offset = (timerCount / timerCountElement.dataset.timeout) * 440;
    circleAnimation.style.strokeDashoffset = `${offset}`;

    if (timerCount <= 0) {
      clearInterval(countdownInterval);
      onCountDownEnd?.();
    }
    timerCount -= 1;
  }, 1000);
}

export function showCompatibilityCheckModal(
  passedChecks,
  checks,
  onCountDownEnd,
  enableCounter = false,
) {
  const compatibilityModal = document.getElementById('compatibility-overlay');

  if (compatibilityModal.style.display !== '') {
    return;
  }
  compatibilityModal.style.display = 'flex';
  setIconsForChecks(passedChecks, checks);
  if (enableCounter) {
    setupTimer(onCountDownEnd);
  }
}
