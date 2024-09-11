import { setupAlert, showViolationWarning } from './utils/alert';
import {
  DEFAULT_SCREENSHOT_RESIZE_OPTIONS,
  MAX_EVENTS_BEFORE_SEND,
  SNAPSHOT_SCREENSHOT_FREQUENCY,
  VIOLATIONS,
} from './utils/constants';
import { dispatchViolationEvent } from './utils/events';
import { appendBlockerScreen, enforceFullScreen } from './utils/fullScreenBlocker';
import { initializeModal } from './utils/instructionModal';
import { checkBandwidth } from './utils/network';
import { setupScreenshot } from './utils/screenshot';
import detectBrowserBlur from './utils/violations/browserBlur';
import detectCopyPasteCut from './utils/violations/copyPasteCut';
import detectExitTab from './utils/violations/exitTab';
import detectRestrictedKeyEvents from './utils/violations/restrictedKeyEvent';
import detectRightClickDisabled from './utils/violations/rightClick';
import detectTabSwitch from './utils/violations/tabSwitch';
import preventTextSelection from './utils/violations/textSelection';
import {
  detectWebcam,
  disableWebcamBlocker,
  setupSnapshotCapture,
  setupWebcam,
  showWebcamBlocker,
} from './utils/webcam';

import './assets/styles/alert.scss';
import './assets/styles/fullScreenBlocker.scss';
import './assets/styles/instructionModal.scss';
import './assets/styles/webcam-blocker.scss';

export default class Proctor {
  constructor({
    instructionModal = {},
    eventsConfig = {},
    disqualificationConfig = {},
    config = {},
    snapshotConfig = {},
    screenshotConfig = {},
    callbacks = {},
  }) {
    this.instructionModal = {
      enabled: true,
      ...instructionModal,
    };
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
      [VIOLATIONS.browserBlur]: {
        name: VIOLATIONS.browserBlur,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.browserBlur,
      },
      [VIOLATIONS.rightClick]: {
        name: VIOLATIONS.rightClick,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.rightClick,
      },
      [VIOLATIONS.exitTab]: {
        name: VIOLATIONS.exitTab,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.exitTab,
      },
      [VIOLATIONS.copyPasteCut]: {
        name: VIOLATIONS.copyPasteCut,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.copyPasteCut,
      },
      [VIOLATIONS.restrictedKeyEvent]: {
        name: VIOLATIONS.restrictedKeyEvent,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.restrictedKeyEvent,
      },
      [VIOLATIONS.textSelection]: {
        name: VIOLATIONS.textSelection,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.textSelection,
      },
      [VIOLATIONS.fullScreen]: {
        name: VIOLATIONS.fullScreen,
        enabled: true,
        showAlert: true,
        recordViolation: true,
        ...config.fullScreen,
      },
      ...config,
    };
    this.snapshotConfig = {
      enabled: true,
      frequency: SNAPSHOT_SCREENSHOT_FREQUENCY, // 5s by default
      optional: true,
      ...snapshotConfig,
    };
    this.screenshotConfig = {
      enabled: true,
      frequency: SNAPSHOT_SCREENSHOT_FREQUENCY,
      resizeTo: DEFAULT_SCREENSHOT_RESIZE_OPTIONS,
      ...screenshotConfig,
    };
    this.callbacks = {
      onDisqualified: callbacks.onDisqualified || (() => {}),
      onWebcamDisabled: callbacks.onWebcamDisabled || (() => {}),
      onWebcamEnabled: callbacks.onWebcamEnabled || (() => {}),
      onSnapshotSuccess: callbacks.onSnapshotSuccess || (() => {}),
      onSnapshotFailure: callbacks.onSnapshotFailure || (() => {}),
      onScreenshotDisabled: callbacks.onScreenshotDisabled || (() => {}),
      onScreenshotEnabled: callbacks.onScreenshotEnabled || (() => {}),
      onScreenshotFailure: callbacks.onScreenshotFailure || (() => {}),
      onScreenshotSuccess: callbacks.onScreenshotSuccess || (() => {}),
      onFullScreenEnabled: callbacks.onFullScreenEnabled || (() => {}),
      onFullScreenDisabled: callbacks.onFullScreenDisabled || (() => {}),
    };
    this.violationEvents = [];
    this.recordedViolationEvents = []; // Store events for batch sending
    this.initialize();
  }

  initialize() {
    if (this.config.fullScreen.enabled) {
      appendBlockerScreen();
      enforceFullScreen({
        onExitCallback: this.handleViolation.bind(this),
        onFullScreenDisabled: this.handleFullScreenDisabled.bind(this),
        onFullScreenEnabled: this.handleFullScreenEnabled.bind(this),
      });
    }

    if (this.config.tabSwitch.enabled) {
      detectTabSwitch(this.handleViolation.bind(this));
    }

    if (this.config.browserBlur.enabled) {
      detectBrowserBlur(this.handleViolation.bind(this));
    }

    if (this.config.rightClick.enabled) {
      detectRightClickDisabled(this.handleViolation.bind(this));
    }

    if (this.config.exitTab.enabled) {
      detectExitTab(this.handleViolation.bind(this));
    }

    if (this.config.copyPasteCut.enabled) {
      detectCopyPasteCut(this.handleViolation.bind(this));
    }

    if (this.config.restrictedKeyEvent.enabled) {
      detectRestrictedKeyEvents(this.handleViolation.bind(this));
    }

    if (this.config.textSelection.enabled) {
      preventTextSelection();
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (this.instructionModal.enabled) {
        initializeModal(this.instructionModal.configs);
      }
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

      if (this.screenshotConfig.enabled) {
        setupScreenshot({
          onScreenshotEnabled: this.handleScreenshotEnabled.bind(this),
          onScreenshotDisabled: this.handleScreenshotDisabled.bind(this),
          onScreenshotFailure: this.handleScreenshotFailure.bind(this),
          onScreenshotSuccess: this.handleScreenshotSuccess.bind(this),
          frequency: this.screenshotConfig.frequency,
          resizeDimensions: this.screenshotConfig.resizeTo,
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

  handleScreenshotDisabled() {
    // Show blocker
    this.callbacks.onScreenshotDisabled();
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

  handleScreenshotEnabled() {
    // Disable blocker
    this.callbacks.onScreenshotEnabled();
  }

  handleSnapshotSuccess() {
    // Send data to s3
    this.callbacks.onSnapshotSuccess();
  }

  handleScreenshotSuccess() {
    this.callbacks.onScreenshotSuccess();
  }

  handleSnapshotFailure() {
    this.callbacks.onSnapshotFailure();
  }

  handleFullScreenDisabled() {
    this.callbacks.onFullScreenDisabled();
  }

  handleFullScreenEnabled() {
    this.callbacks.onFullScreenEnabled();
  }

  handleScreenshotFailure() {
    this.callbacks.onScreenshotFailure();
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
