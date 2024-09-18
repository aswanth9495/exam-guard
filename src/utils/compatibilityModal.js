import compatibilityModalHtml from '../templates/compatibility_modal.html';
import { DEFAULT_MODAL_CONFIG } from './constants';
import checkMarkImage from '../assets/images/checkMark.svg';
import failureMark from '../assets/images/failMark.svg';

let countdownInterval = null;

export function setIconsForChecks(passedChecks = {}) {
  const camIcon = document.getElementById('webcam-check');
  const fullscreenIcon = document.getElementById('fullscreen-check');
  const networkIcon = document.getElementById('network-check');
  camIcon.src = failureMark;
  fullscreenIcon.src = failureMark;
  networkIcon.src = failureMark;
  if (passedChecks.webcam) {
    camIcon.src = checkMarkImage;
  }
  if (passedChecks.fullscreen) {
    fullscreenIcon.src = checkMarkImage;
  }
  if (passedChecks.networkSpeed) {
    networkIcon.src = checkMarkImage;
  }
}

export function setupCompatibilityCheckModal(onContinueClick, config = {}) {
  if (!config.enable) {
    return;
  }
  const modalConfig = {
    config,
    ...DEFAULT_MODAL_CONFIG,
  };
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = compatibilityModalHtml;
  document.body.appendChild(modalContainer);

  const continueBtn = document.getElementById('enter-test-btn');
  const modalHeading = document.getElementById('compatibility-modal-heading');
  const compatibilityModal = document.getElementById('compatibility-overlay');
  if (modalConfig.buttonText) {
    continueBtn.textContent = modalConfig.buttonText;
  }

  if (modalConfig.headingText) {
    modalHeading.textContent = modalConfig.headingText;
  }

  continueBtn.addEventListener('click', () => {
    compatibilityModal.style.display = '';
    clearInterval(countdownInterval);
    onContinueClick?.();
  });
}

function setupTimer() {
  const timerCountElement = document.getElementById('compatibility-modal-timer-count');
  const circleAnimation = document.getElementById('compatibility-modal-timer-circle');
  let timerCount = 15;

  countdownInterval = setInterval(() => {
    timerCountElement.textContent = timerCount;

    const offset = (timerCount / 15) * 440;
    circleAnimation.style.strokeDashoffset = `${offset}`;

    if (timerCount <= 0) {
      clearInterval(countdownInterval);
    }
    timerCount -= 1;
  }, 1000);
}

export function showCompatibilityCheckModal(passedChecks, enableDisqualification = false) {
  const compatibilityModal = document.getElementById('compatibility-overlay');

  if (compatibilityModal.style.display !== '') {
    return;
  }
  compatibilityModal.style.display = 'flex';
  setIconsForChecks(passedChecks);
  setupTimer();
}
