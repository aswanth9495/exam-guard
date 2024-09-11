import instructionModalTemplate from '../templates/instructionModal.html';
import { DEFAULT_MODAL_CONFIG } from './constants';

export function appendInstructionsModal(configs) {
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

export function showInstructionsModal() {
  const instructionsOverlay = document.getElementById('instructions-overlay');
  const enterTestButton = document.getElementById('enter-test-btn');
  instructionsOverlay.style.display = 'block';

  enterTestButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
  });
}

export function initializeModal(configs = DEFAULT_MODAL_CONFIG) {
  appendInstructionsModal(configs);
  showInstructionsModal();
}
