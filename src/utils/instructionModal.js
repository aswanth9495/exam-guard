import instructionModalTemplate from '../templates/instructionModal.html';
import { DEFAULT_MODAL_CONFIG } from './constants';

export function appendInstructionsModal(disqualifyUser, configs) {
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
  configs = DEFAULT_MODAL_CONFIG,
) {
  appendInstructionsModal(disqualifyUser, configs);
  showInstructionsModal(onContinueClick);
}
