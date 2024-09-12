import instructionModalTemplate from '../templates/instructionModal.html';
import { DEFAULT_MODAL_CONFIG } from './constants';
import checkMarkImage from '../assets/images/checkMark.svg';
import failureMark from '../assets/images/failMark.svg';

function setIconsForChecks(passedChecks = {}) {
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

export function appendInstructionsModal(disqualifyUser, configs, passedChecks) {
  const disqualifyNote = document.getElementById('instructions-modal-disqualify');
  if (disqualifyNote && disqualifyUser) {
    disqualifyNote.textContent = 'You will be disqualified in 15 secs if the above criterias are not met';

    disqualifyNote.style.color = 'red';
  }
  const instructionsOverlay = document.getElementById('instructions-overlay');
  if (instructionsOverlay) return;
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = instructionModalTemplate;
  document.body.appendChild(modalContainer);
  const enterTestButton = document.getElementById('enter-test-btn');
  const modalHeading = document.querySelector('.instructions-modal__heading');
  setIconsForChecks(passedChecks);

  if (configs.buttonText) {
    enterTestButton.textContent = configs.buttonText;
  }

  if (configs.headingText) {
    modalHeading.textContent = configs.headingText;
  }
}

export function showInstructionsModal(onContinueClick) {
  const instructionsOverlay = document.getElementById('instructions-overlay');
  const enterTestButton = document.getElementById('enter-test-btn');
  instructionsOverlay.style.display = 'block';

  enterTestButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    onContinueClick?.();
  });
}

export function initializeInstructionsModal(
  onContinueClick,
  disqualifyUser = false,
  passedChecks = {},
  configs = DEFAULT_MODAL_CONFIG,
) {
  appendInstructionsModal(disqualifyUser, configs, passedChecks);
  showInstructionsModal(onContinueClick);
}
