import alertHtml from '../templates/alert.html';

export function closeModal() {
  const modal = document.getElementById('warning-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

export function setupAlertUI() {
  const closeButton = document.getElementById('warning-modal-close-btn');
  const actionButton = document.getElementById('warning-modal-action');

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (actionButton) {
    actionButton.addEventListener('click', closeModal);
  }
}

export function appendAlertHtml() {
  const alertContainer = document.createElement('div');
  alertContainer.innerHTML = alertHtml;
  document.body.appendChild(alertContainer);

  // Set up the UI (close button functionality)
  setupAlertUI();
}

export function showViolationWarning(heading, text) {
  const modal = document.getElementById('warning-modal');
  const modalHeading = document.getElementById('warning-modal-heading');
  const modalText = document.getElementById('warning-modal-text');

  if (modal && modalHeading && modalText) {
    // Set new heading and text
    modalHeading.textContent = heading;
    modalText.textContent = text;

    // Display the modal
    modal.style.display = 'block';
  }
}
