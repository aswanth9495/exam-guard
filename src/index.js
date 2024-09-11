import { dispatchCustomEvent } from './utils/events';
import { setupAlert, showViolationWarning } from './utils/alert';
import { setupWebcam } from './utils/webcam';
import detectTabSwitch from './utils/violations/tabSwitch';
import { VIOLATIONS, DEFAULT_SNAPSHOT_FREQUENCY } from './utils/constants';

import './assets/styles/alert.scss';

export default class Proctor {
  constructor({
    eventsUrl,
    config,
    apiKey,
    s3StoreConfig,
    snapshotConfig,
    callbacks = {},

  }) {
    this.eventsUrl = eventsUrl;
    this.apiKey = apiKey;
    this.s3StoreConfig = s3StoreConfig;
    this.config = {
      [VIOLATIONS.tabSwitch]: {
        name: VIOLATIONS.tabSwitch,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.tabSwitch,
      },
      ...config,
    };
    this.snapshotConfig = {
      enabled: true,
      frequency: DEFAULT_SNAPSHOT_FREQUENCY, // 5s by default
      optional: true,
      ...snapshotConfig,
    };
    this.callbacks = {
      onWebcamDisabled: callbacks.onWebcamDisabled || (() => {}),
      onWebcamEnabled: callbacks.onWebcamEnabled || (() => {}),
      onSnapshotSuccess: callbacks.onSnapshotSuccess || (() => {}),
      onSnapshotFailure: callbacks.onSnapshotFailure || (() => {}),
    };
    this.violationEvents = [];
    this.initialize();
  }

  initialize() {
    if (this.config.tabSwitch.enabled) {
      detectTabSwitch(this.handleViolation.bind(this));
    }

    document.addEventListener('DOMContentLoaded', () => {
      setupAlert();
      // Setup webcam if snapshots are enabled
      if (this.snapshotConfig.enabled) {
        setupWebcam({
          onWebcamEnabled: this.handleWebcamEnabled.bind(this),
          onWebcamDisabled: this.handleWebcamDisabled.bind(this),
          onSnapshotSucccess: this.handleSnapshotSuccess.bind(this),
          onSnapshotFailure: this.handleSnapshotFailure.bind(this),
          optional: this.snapshotConfig.optional,
          frequency: this.snapshotConfig.frequency,
        });
      }
    });
  }

  handleWebcamDisabled() {
    // Show blocker
    this.callbacks.onWebcamDisabled();
  }

  handleWebcamEnabled() {
    // Disable blocker
    this.callbacks.onWebcamEnabled();
  }

  handleSnapshotSuccess() {
    // Send data to s3
    this.callbacks.onSnapshotSuccess();
  }

  handleSnapshotFailure() {
    this.callbacks.onSnapshotFailure();
  }

  handleViolation(type, value = null) {
    console.log(this.config[type]);
    const violation = {
      type: this.config[type].name,
      value,
      timestamp: `${new Date().toJSON().slice(0, 19).replace('T', ' ')} UTC`,
    };

    if (this.config[type].showAlert) {
      showViolationWarning(
        'Warning',
        `You performed a violation during the test. 
         Repeating this action may result in disqualification 
         and a failed test attempt.`,
      );
    }
    if (this.config[type].recordViolation) {
      this.recordViolation(violation);
    }
    dispatchCustomEvent(type, violation);
  }

  recordViolation(violation) {
    this.violationEvents.push(violation);
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
