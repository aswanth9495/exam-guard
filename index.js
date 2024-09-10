import { dispatchCustomEvent } from './utils/events';
import alertHtml from './templates/alert.html';
import './assets/styles/alert.scss';

function closeModal() {
  const modal = document.getElementById('warning-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function setupAlertUI() {
  const closeButton = document.getElementById('warning-modal-close-btn');
  const actionButton = document.getElementById('warning-modal-action');

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (actionButton) {
    actionButton.addEventListener('click', closeModal);
  }
}

function appendAlertHtml() {
  const alertContainer = document.createElement('div');
  alertContainer.innerHTML = alertHtml;
  document.body.appendChild(alertContainer);

  // Set up the UI (close button functionality)
  setupAlertUI();
}

function showViolationWarning(heading, text) {
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

export default class Proctor {
  constructor({
    eventsUrl,
    config,
    apiKey,
    s3StoreConfig,
  }) {
    this.eventsUrl = eventsUrl;
    this.apiKey = apiKey;
    this.s3StoreConfig = s3StoreConfig;
    this.config = {
      disableTabSwitch: {
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.disableTabSwitch,
      },
      ...config,
    };
    this.violationEvents = [];
    this.initialize();
  }

  initialize() {
    if (this.config.disableTabSwitch.enabled) {
      document.addEventListener('visibilitychange', this.handleTabSwitch.bind(this));
    }
    // Append custom alert HTML to the DOM
    appendAlertHtml();
  }

  handleTabSwitch() {
    if (document.hidden && this.config.disableTabSwitch.enabled) {
      if (this.config.disableTabSwitch.showAlert) {
        showViolationWarning('Warning', 'This is a warning for violation performed by the user');
      }
      if (this.config.disableTabSwitch.recordViolation) {
        this.recordViolation('tabSwitch');
      }
    }
  }

  recordViolation(type, value = null) {
    const violation = {
      type,
      value,
      timestamp: `${new Date().toJSON().slice(0, 19).replace('T', ' ')} UTC`,
    };
    this.violationEvents.push(violation);
    dispatchCustomEvent(type, violation);
    this.sendEvent();
  }

  sendEvent() {
    const payload = {
      events: this.violationEvents,
    };

    fetch(this.eventsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((error) => console.error('Failed to send event:', error));
  }

  on(violationType, callback) {
    document.addEventListener(violationType, (event) => {
      callback(this.getTotalViolationsCountByType(violationType), event);
    });
  }

  getTotalViolationsCountByType(type) {
    return this.violationEvents.filter((violation) => violation.type === type).length;
  }

  getTotalViolationsCount() {
    return this.violationEvents.length;
  }
}
