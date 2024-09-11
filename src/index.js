import { setupAlert, showViolationWarning } from './utils/alert';
import {
  DEFAULT_SCREENSHOT_RESIZE_OPTIONS,
  MAX_EVENTS_BEFORE_SEND,
  SNAPSHOT_SCREENSHOT_FREQUENCY,
  VIOLATIONS,
} from './utils/constants';
import { dispatchViolationEvent } from './utils/events';
import { detectFullScreen, showFullScreenDefaultMessage, showFullScreenInitialMessage } from './utils/fullScreenBlocker';
import { initializeInstructionsModal } from './utils/instructionModal';
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
    this.initializeProctoring = this.initializeProctoring.bind(this);
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
      enabled: true, // Enable when onDisqualify is added
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
        enabled: false,
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
      onCompatibilityCheckSuccess: callbacks.onCompatibilityCheckSuccess || (() => {}),
      onCompatibilityChecFailure: callbacks.onCompatibilityChecFailure || (() => {}),
    };
    this.violationEvents = [];
    this.recordedViolationEvents = []; // Store events for batch sending
  }

  initializeProctoring() {
    if (this.config.fullScreen.enabled) {
      detectFullScreen({
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

    // Listen to tab close or exit
    this.handleWindowUnload();
  }

  runCompatibilityChecks(onSuccess, onFailure) {
    const compatibilityChecks = {
      webcam: this.snapshotConfig.enabled,
      networkSpeed: this.snapshotConfig.enabled,
      fullscreen: this.config[VIOLATIONS.fullScreen].enabled,
    };

    // Initialize object to store the result of passed checks
    const passedChecks = {
      webcam: false,
      networkSpeed: false,
      fullscreen: false,
    };

    // Array to store all compatibility promises
    const compatibilityPromises = [];

    // Webcam check
    if (compatibilityChecks.webcam) {
      const webcamCheck = new Promise((resolve, reject) => {
        setupWebcam();
        detectWebcam({
          onWebcamDisabled: () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('webcam');
          },
          onWebcamEnabled: () => {
            passedChecks.webcam = true; // Update passed checks
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
          if (isLowBandwidth) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('network_speed');
          }
          passedChecks.networkSpeed = true; // Update passed checks
          return 'network_speed';
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        .catch(() => Promise.reject('network_speed'));

      compatibilityPromises.push(networkCheck);
    }

    // Full screen check
    if (compatibilityChecks.fullscreen) {
      showFullScreenInitialMessage();
      const fullScreenCheck = new Promise((resolve, reject) => {
        detectFullScreen({
          onFullScreenEnabled: () => {
            passedChecks.fullscreen = true; // Update passed checks
            resolve('fullscreen');
          },
          onFullScreenDisabled: () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('fullscreen');
          },
        });
      });
      compatibilityPromises.push(fullScreenCheck);
    }

    // Wait for all compatibility checks to complete
    Promise.allSettled(compatibilityPromises)
      .then((results) => {
        // If any check fails, handle failure and return the updated object
        const failedCheck = results.find((result) => result.status === 'rejected');

        if (failedCheck) {
          initializeInstructionsModal(this.runCompatibilityChecks.bind(this, onSuccess, onFailure));
          onFailure?.(failedCheck.reason, passedChecks);
        } else {
          onSuccess?.(passedChecks);
        }
      })
      .catch((failedCheck) => {
        initializeInstructionsModal(this.runCompatibilityChecks.bind(this, onSuccess, onFailure));
        // Handle any failure in individual checks
        onFailure?.(failedCheck, passedChecks);
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
    this.callbacks.onScreenshotEnabled();
  }

  handleSnapshotSuccess({ blob }) {
    this.callbacks.onSnapshotSuccess({ blob });
  }

  handleScreenshotSuccess({ blob }) {
    this.callbacks.onScreenshotSuccess({ blob });
  }

  handleSnapshotFailure() {
    this.callbacks.onSnapshotFailure();
  }

  handleFullScreenDisabled() {
    console.log('%c⧭', 'color: #f27999', 'close');
    showFullScreenDefaultMessage({
      onExitCallback: () => {},
    });
    this.callbacks.onFullScreenDisabled();
  }

  handleFullScreenEnabled() {
    this.callbacks.onFullScreenEnabled();
  }

  handleScreenshotFailure() {
    this.callbacks.onScreenshotFailure();
  }

  handleViolation(type, value = null) {
    console.log('%c⧭', 'color: #40fff2', 'violation handled');
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
        true,
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
    fetch(this.eventsConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(() => {
      this.recordedViolationEvents = [];
    }).catch((error) => {
      console.error('Failed to send event:', error);
    });
  }

  handleWindowUnload() {
    // Send events when the user tries to exit or close the window/tab
    window.addEventListener('beforeunload', () => {
      this.sendEvents();
    });
  }

  showInstructionsModal() {
    initializeInstructionsModal({
      ...this.instructionModal,
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
