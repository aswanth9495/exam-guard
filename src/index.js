import { dispatchViolationEvent } from './utils/events';
import { setupAlert, showViolationWarning } from './utils/alert';
import {
  detectWebcam, setupSnapshotCapture, showWebcamBlocker, disableWebcamBlocker, setupWebcam,
} from './utils/webcam';
import { checkBandwidth } from './utils/network';
import detectTabSwitch from './utils/violations/tabSwitch';
import { VIOLATIONS, DEFAULT_SNAPSHOT_FREQUENCY, MAX_EVENTS_BEFORE_SEND } from './utils/constants';

import './assets/styles/alert.scss';
import './assets/styles/webcam-blocker.scss';

export default class Proctor {
  constructor({
    eventsConfig = {},
    disqualificationConfig = {},
    config = {},
    snapshotConfig = {},
    callbacks = {},
  }) {
    this.eventsConfig = {
      url: null,
      maxEventsBeforeSend: MAX_EVENTS_BEFORE_SEND,
      ...eventsConfig,
    };
    this.disqualificationConfig = {
      enabled: false, // Enable when onDisqualify is added
      eventCountThreshold: 5, // Number of violations after which disqualification will occur
      alertHeading: 'Disqualification Alert',
      alertMessage: 'You have been disqualified after exceeding the allowed number of violations.',
      ...disqualificationConfig,
    };
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
      optional: false,
      ...snapshotConfig,
    };
    this.callbacks = {
      onDisqualified: callbacks.onDisqualified || (() => {}),
      onWebcamDisabled: callbacks.onWebcamDisabled || (() => {}),
      onWebcamEnabled: callbacks.onWebcamEnabled || (() => {}),
      onSnapshotSuccess: callbacks.onSnapshotSuccess || (() => {}),
      onSnapshotFailure: callbacks.onSnapshotFailure || (() => {}),
    };
    this.violationEvents = [];
    this.recordedViolationEvents = []; // Store events for batch sending
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
        setupWebcam();
        detectWebcam({
          onWebcamEnabled: this.handleWebcamEnabled.bind(this),
          onWebcamDisabled: this.handleWebcamDisabled.bind(this),
          optional: this.snapshotConfig.optional,
        });
      }
    });
    // Listen to tab close or exit
    this.handleWindowUnload();
  }

  runCompatibilityChecks() {
    const compatibilityChecks = {
      webcam: this.snapshotConfig.enabled,
      networkSpeed: this.snapshotConfig.enabled,
    };

    console.log('Checking compatibility');

    // Array to store all compatibility promises
    const compatibilityPromises = [];

    // Webcam check
    if (compatibilityChecks.webcam) {
      const webcamCheck = new Promise((resolve, reject) => {
        detectWebcam({
          onWebcamDisabled: () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('webcam');
          },
          onWebcamEnabled: () => {
            resolve('webcam');
          },
        });
      });
      compatibilityPromises.push(webcamCheck);
    }

    // Network speed check
    if (compatibilityChecks.networkSpeed) {
      const networkCheck = checkBandwidth()
        .then((isLowBandwidth) => {
          if (!isLowBandwidth) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('network_speed');
          }
          return 'network_speed';
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        .catch(() => Promise.reject('network_speed'));

      compatibilityPromises.push(networkCheck);
    }

    // Wait for all compatibility checks to complete
    Promise.all(compatibilityPromises)
      .then(() => {
        // If all checks pass, run success callback
        this.callbacks.onCompatibilityCheckSuccess();
      })
      .catch((failedCheck) => {
        // Handle any failure in individual checks
        this.callbacks.onCompatibilityCheckFailure(failedCheck);
      });
  }

  handleWebcamDisabled({ error }) {
    showWebcamBlocker();
    this.callbacks.onWebcamDisabled({ error });
  }

  handleWebcamEnabled() {
    disableWebcamBlocker();
    setupSnapshotCapture({
      onSnapshotSuccess: this.handleSnapshotSuccess.bind(this),
      onSnapshotFailure: this.handleSnapshotFailure.bind(this),
      frequency: this.snapshotConfig.frequency,
    });

    this.callbacks.onWebcamEnabled();
  }

  handleSnapshotSuccess({ blob }) {
    this.callbacks.onSnapshotSuccess({ blob });
  }

  handleSnapshotFailure({ err }) {
    this.callbacks.onSnapshotFailure(err);
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
    dispatchViolationEvent(type, violation);

    if (this.disqualificationConfig.enabled
      && this.getTotalViolationsCount() >= this.disqualificationConfig.eventCountThreshold) {
      this.sendEvents(); // To send any events before disqualifying the user
      // Show disqualification warning before calling the disqualified callback
      showViolationWarning(
        this.disqualificationConfig.alertHeading,
        this.disqualificationConfig.alertMessage,
      );
      this.callbacks.onDisqualified(); // Trigger disqualification callback
    }
  }

  recordViolation(violation) {
    this.violationEvents.push(violation);
    // Push the violation to the recordedViolationEvents array
    this.recordedViolationEvents.push(violation);

    // Check if the max threshold is exceeded
    if (this.recordedViolationEvents.length >= this.eventsConfig.maxEventsBeforeSend) {
      this.sendEvents(); // Send the batch of events when threshold is reached
    }
  }

  sendEvents() {
    if (!this.eventsConfig.url) return;
    if (this.recordedViolationEvents.length === 0) return;

    const payload = {
      events: this.recordedViolationEvents,
    };

    console.log('%c⧭', 'color: #e50000', 'Events being sent to backend:');

    console.log('%c⧭', 'color: #733d00', 'Payload:', payload);
    fetch(this.eventsConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(() => {
      this.recordedViolationEvents = [];
    }).catch((error) => console.error('Failed to send event:', error));
  }

  handleWindowUnload() {
    // Send events when the user tries to exit or close the window/tab
    window.addEventListener('beforeunload', () => {
      this.sendEvents();
    });
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
