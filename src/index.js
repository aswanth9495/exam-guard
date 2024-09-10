import { dispatchCustomEvent } from './utils/events';
import { appendAlertHtml, showViolationWarning } from './utils/alert';

import './assets/styles/alert.scss';

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
    document.addEventListener('DOMContentLoaded', () => {
      appendAlertHtml();
    });
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
