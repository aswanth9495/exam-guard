import { setupAlert, showViolationWarning, closeModal } from './utils/alert';
import {
  DEFAULT_SCREENSHOT_RESIZE_OPTIONS,
  DEFAULT_SNAPSHOT_RESIZE_OPTIONS,
  MAX_EVENTS_BEFORE_SEND,
  SNAPSHOT_SCREENSHOT_FREQUENCY,
  VIOLATIONS,
  DEFAULT_HEADERS_CONTENT_TYPE,
} from './utils/constants';
import { dispatchGenericViolationEvent, dispatchViolationEvent } from './utils/events';
import {
  addFullscreenKeyboardListener, detectFullScreen, isFullScreen, requestFullScreen,
} from './utils/fullScreenBlocker';
import { hideCompatibilityModal, setupCompatibilityCheckModal, showCompatibilityCheckModal } from './utils/compatibilityModal';
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
  detectCtrlShiftI, detectAltTab, detectCmdH, detectCmdM, detectCtrlW,
  detectCmdW, detectCtrlQ, detectCtrlShiftC, detectCtrlShiftJ, detectCmdQ,
} from './utils/violations/keyEvents';

import {
  detectWebcam,
  setupSnapshotCapture,
  setupWebcam,
} from './utils/webcam';

import './assets/styles/alert.scss';
import './assets/styles/fullScreenBlocker.scss';
import './assets/styles/compatibility-modal.scss';
import './assets/styles/webcam-blocker.scss';

export default class Proctor {
  constructor({
    baseUrl = null,
    eventsConfig = {},
    disqualificationConfig = {},
    config = {},
    snapshotConfig = {},
    screenshotConfig = {},
    compatibilityCheckConfig = {},
    callbacks = {},
    enableAllAlerts = false,
    headerOptions = {},
  }) {
    this.baseUrl = baseUrl;
    this.eventsConfig = {
      maxEventsBeforeSend: MAX_EVENTS_BEFORE_SEND,
      endpoint: eventsConfig.endpoint,
      ...eventsConfig,
    };
    this.headerOptions = {
      csrfToken: null,
      contentType: DEFAULT_HEADERS_CONTENT_TYPE,
      ...headerOptions,
    };
    this.compatibilityCheckConfig = {
      enable: true,
      showAlert: enableAllAlerts,
      frequency: 5000,
      maxFrequency: 60000,
      cpuThreshold: 30, // Common CPU threshold in case of network latency test
      disqualificationTimeout: 45000,
      showTimer: true,
      buttonText: 'Continue',
      headingText: 'System Check: Configure Required Settings',
      ...compatibilityCheckConfig,
    };
    this.disqualificationConfig = {
      enabled: true, // Enable when onDisqualify is added
      eventCountThreshold: 5, // Number of violations after which disqualification will occur
      showAlert: enableAllAlerts,
      alertHeading: 'Disqualification Alert',
      alertMessage: 'You have been disqualified from the contest',
      ...disqualificationConfig,
    };
    this.proctoringInitialised = false;
    this.config = {
      [VIOLATIONS.tabSwitch]: {
        name: VIOLATIONS.tabSwitch,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.tabSwitch,
      },
      [VIOLATIONS.browserBlur]: {
        name: VIOLATIONS.browserBlur,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.browserBlur,
      },
      [VIOLATIONS.rightClick]: {
        name: VIOLATIONS.rightClick,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.rightClick,
      },
      [VIOLATIONS.exitTab]: {
        name: VIOLATIONS.exitTab,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.exitTab,
      },
      [VIOLATIONS.copyPasteCut]: {
        name: VIOLATIONS.copyPasteCut,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.copyPasteCut,
      },
      [VIOLATIONS.restrictedKeyEvent]: {
        name: VIOLATIONS.restrictedKeyEvent,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.restrictedKeyEvent,
      },
      [VIOLATIONS.textSelection]: {
        name: VIOLATIONS.textSelection,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.textSelection,
      },
      [VIOLATIONS.fullScreen]: {
        name: VIOLATIONS.fullScreen,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.fullScreen,
      },
      [VIOLATIONS.ctrlShiftI]: {
        name: VIOLATIONS.ctrlShiftI,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.ctrlShiftI,
      },
      [VIOLATIONS.ctrlShiftC]: {
        name: VIOLATIONS.ctrlShiftC,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.ctrlShiftC,
      },
      [VIOLATIONS.ctrlShiftJ]: {
        name: VIOLATIONS.ctrlShiftJ,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.ctrlShiftJ,
      },
      [VIOLATIONS.altTab]: {
        name: VIOLATIONS.altTab,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.altTab,
      },
      [VIOLATIONS.ctrlQ]: {
        name: VIOLATIONS.ctrlQ,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.ctrlQ,
      },
      [VIOLATIONS.ctrlW]: {
        name: VIOLATIONS.ctrlW,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.ctrlW,
      },
      [VIOLATIONS.cmdH]: {
        name: VIOLATIONS.cmdH,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.cmdH,
      },
      [VIOLATIONS.cmdQ]: {
        name: VIOLATIONS.cmdQ,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.cmdQ,
      },
      [VIOLATIONS.cmdM]: {
        name: VIOLATIONS.cmdM,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.cmdM,
      },
      [VIOLATIONS.cmdW]: {
        name: VIOLATIONS.cmdW,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.cmdW,
      },
    };
    this.snapshotConfig = {
      enabled: false,
      frequency: SNAPSHOT_SCREENSHOT_FREQUENCY, // 5s by default
      resizeTo: DEFAULT_SNAPSHOT_RESIZE_OPTIONS,
      optional: false,
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
      onCompatibilityCheckFail: callbacks.onCompatibilityCheckFail || (() => {}),
    };
    this.violationEvents = [];
    this.recordedViolationEvents = []; // Store events for batch sending
    this.failedCompatibilityChecks = false; // To track if checks have failed
    this.compatibilityCheckInterval = null;
    this.initializeProctoring = this.initializeProctoring.bind(this);
    this.runCompatibilityChecks = this.runCompatibilityChecks.bind(this);
    this.runAdaptiveCompatibilityChecks = this.runAdaptiveCompatibilityChecks.bind(this);
    this.initialFullScreen = false;
    setupAlert();
    addFullscreenKeyboardListener();
    setupCompatibilityCheckModal(() => {
      this.runCompatibilityChecks(
        this.handleCompatibilitySuccess.bind(this),
        this.handleCompatibilityFailure.bind(this),
      );
      showViolationWarning(
        'System check failed',
        'Please ensure all the required settings are enabled',
        true,
      );
    }, this.compatibilityCheckConfig);
  }

  initializeProctoring() {
    this.proctoringInitialised = true;
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

    if (this.config.ctrlShiftI.enabled) {
      detectCtrlShiftI(this.handleViolation.bind(this));
    }

    if (this.config.ctrlShiftC.enabled) {
      detectCtrlShiftC(this.handleViolation.bind(this));
    }

    if (this.config.ctrlShiftJ.enabled) {
      detectCtrlShiftJ(this.handleViolation.bind(this));
    }

    if (this.config.altTab.enabled) {
      detectAltTab(this.handleViolation.bind(this));
    }

    if (this.config.ctrlQ.enabled) {
      detectCtrlQ(this.handleViolation.bind(this));
    }

    if (this.config.ctrlW.enabled) {
      detectCtrlW(this.handleViolation.bind(this));
    }

    if (this.config.cmdH.enabled) {
      detectCmdH(this.handleViolation.bind(this));
    }

    if (this.config.cmdW.enabled) {
      detectCmdW(this.handleViolation.bind(this));
    }

    if (this.config.cmdM.enabled) {
      detectCmdM(this.handleViolation.bind(this));
    }

    if (this.config.cmdQ.enabled) {
      detectCmdQ(this.handleViolation.bind(this));
    }

    if (this.config.restrictedKeyEvent.enabled) {
      detectRestrictedKeyEvents(this.handleViolation.bind(this));
    }

    if (this.config.textSelection.enabled) {
      preventTextSelection();
    }

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
    this.startCompatibilityChecks();
  }

  startCompatibilityChecks() {
    if (!this.compatibilityCheckConfig.enable) return;
    setTimeout(this.runAdaptiveCompatibilityChecks, this.compatibilityCheckConfig.frequency);
  }

  runAdaptiveCompatibilityChecks() {
    const start = performance.now();

    // Run compatibility checks (e.g., webcam, network speed, etc.)
    this.runCompatibilityChecks(
      this.handleCompatibilitySuccess.bind(this),
      this.handleCompatibilityFailure.bind(this),
    );

    const duration = performance.now() - start;

    /* Debugging logs */
    console.log('%c%s', 'color: #ff2525', 'Time take for running Compatibility checks (in ms):', duration);

    console.log('%c%s', 'color: #ff2525', 'Is CPU peformance fine ?: ', duration < this.compatibilityCheckConfig.cpuThreshold);

    // Adjust frequency based on system load
    const delay = duration < this.compatibilityCheckConfig.cpuThreshold
      ? this.compatibilityCheckConfig.frequency
      : this.compatibilityCheckConfig.maxFrequency;

    // Schedule the next check adaptively
    this.compatibilityCheckTimeout = setTimeout(this.runAdaptiveCompatibilityChecks, delay);
  }

  handleCompatibilitySuccess(passedChecks) {
    this.callbacks.onCompatibilityCheckSuccess({ passedChecks });
    // console.log('Compatibility checks passed:', passedChecks);
  }

  handleCompatibilityFailure(failedCheck, passedChecks) {
    this.callbacks.onCompatibilityCheckFail({ failedCheck, passedChecks });
  }

  stopCompatibilityChecks() {
    if (this.compatibilityCheckInterval) {
      clearInterval(this.compatibilityCheckInterval);
    }

    if (this.disqualificationTimeout) {
      clearTimeout(this.disqualificationTimeout);
    }
  }

  runCompatibilityChecks(onSuccess, onFailure) {
    const compatibilityChecks = {
      webcam: this.snapshotConfig.enabled,
      networkSpeed: this.snapshotConfig.enabled || this.screenshotConfig.enabled,
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
      const fullScreenCheck = new Promise((resolve, reject) => {
        if (!isFullScreen()) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('fullscreen');
        } else {
          passedChecks.fullscreen = true; // Update passed checks
          resolve('fullscreen');
        }
      });
      compatibilityPromises.push(fullScreenCheck);
    }

    // Wait for all compatibility checks to complete
    Promise.allSettled(compatibilityPromises)
      .then((results) => {
        // If any check fails, handle failure and return the updated object
        const failedCheck = results.find((result) => result.status === 'rejected');

        if (failedCheck) {
          if (this.compatibilityCheckConfig.showAlert) {
            showCompatibilityCheckModal(
              passedChecks,
              compatibilityChecks,
              () => {
                this.disqualifyUser();
              },
              this.proctoringInitialised && this.compatibilityCheckConfig.showTimer,
            );
          }
          onFailure?.(failedCheck.reason, passedChecks);
        } else {
          hideCompatibilityModal();
          closeModal();
          this.failedCompatibilityChecks = false;
          onSuccess?.(passedChecks);
        }
      })
      .catch((failedCheck) => {
        showCompatibilityCheckModal(
          passedChecks,
          compatibilityChecks,
          () => {
            this.disqualifyUser();
          },
          this.proctoringInitialised,
        );
        // Handle any failure in individual checks
        onFailure?.(failedCheck, passedChecks);
      });
  }

  handleWebcamDisabled({ error }) {
    this.callbacks.onWebcamDisabled({ error });
  }

  handleScreenshotDisabled() {
    // Show blocker
    this.callbacks.onScreenshotDisabled();
  }

  handleWebcamEnabled() {
    setupSnapshotCapture({
      onSnapshotSuccess: this.handleSnapshotSuccess.bind(this),
      onSnapshotFailure: this.handleSnapshotFailure.bind(this),
      frequency: this.snapshotConfig.frequency,
      resizeDimensions: this.snapshotConfig.resizeTo,
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
    if (!this.initialFullScreen) {
      requestFullScreen();
      this.initialFullScreen = true;
    } else {
      this.handleViolation(VIOLATIONS.fullScreen);
      this.callbacks.onFullScreenDisabled();
    }
  }

  handleFullScreenEnabled() {
    if (this.compatibilityCheckConfig.enable) {
      this.runCompatibilityChecks(
        this.handleCompatibilitySuccess.bind(this),
        this.handleCompatibilityFailure.bind(this),
      );
    }
    this.callbacks.onFullScreenEnabled();
  }

  handleScreenshotFailure() {
    this.callbacks.onScreenshotFailure();
  }

  handleViolation(type, value = null, forceDisqualify = false) {
    if (!VIOLATIONS[type]) return;
    const violation = {
      event_type: this.config[type].name,
      event_value: value,
      timestamp: `${new Date().toJSON().slice(0, 19).replace('T', ' ')} UTC`,
      disqualify: this.config[type].disqualify,
    };

    if (this.config[type].showAlert) {
      showViolationWarning(
        'Warning',
        `You performed a violation during the test. 
         Repeating this action may result in disqualification 
         and a failed test attempt.`,
        false,
      );
    }
    if (this.config[type].recordViolation) {
      this.recordViolation(violation);
    }

    dispatchViolationEvent(type, violation);
    dispatchGenericViolationEvent(violation);

    if (forceDisqualify
      || (this.getViolationsCountForDisqualify()
      >= this.disqualificationConfig.eventCountThreshold)) {
      this.disqualifyUser();
    }
  }

  disqualifyUser() {
    if (!this.disqualificationConfig.enabled) return;

    this.sendEvents(); // To send any events before disqualifying the user
    // Show disqualification warning before calling the disqualified callback
    if (this.disqualificationConfig.showAlert) {
      showViolationWarning(
        this.disqualificationConfig.alertHeading,
        this.disqualificationConfig.alertMessage,
        true,
      );
    }
    this.callbacks.onDisqualified(); // Trigger disqualification callback
  }

  recordViolation(violation) {
    this.violationEvents.push(violation);
    // Push the violation to the recordedViolationEvents array
    this.recordedViolationEvents.push({
      event_type: violation.event_type,
      event_value: violation.event_value,
      timestamp: violation.timestamp,
    });

    // Check if the max threshold is exceeded
    if (this.recordedViolationEvents.length >= this.eventsConfig.maxEventsBeforeSend) {
      this.sendEvents(); // Send the batch of events when threshold is reached
    }
  }

  sendEvents() {
    if (!this.baseUrl || !this.eventsConfig.endpoint) return;
    if (this.recordedViolationEvents.length === 0) return;

    const url = new URL(this.eventsConfig.endpoint, this.baseUrl).toString();
    const payload = new URLSearchParams({
      events: JSON.stringify(this.recordedViolationEvents),
    });

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': this.headerOptions.contentType,
        'X-CSRF-TOKEN': this.headerOptions.csrfToken,
      },
      body: payload.toString(),
    }).then(() => {
      this.recordedViolationEvents = [];
    }).catch((error) => {
      console.error('Failed to send event:', error);
    });
  }

  handleWindowUnload() {
    // Send events when the user tries to exit or close the window/tab
    window.addEventListener('beforeunload', this._cleanup.bind(this));
    window.addEventListener('unload', this._cleanup.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  enableFullScreen() {
    if (!isFullScreen()) {
      requestFullScreen();
    }
  }

  on(violationType, callback) {
    document.addEventListener(violationType, (event) => {
      callback(this.violationEvents, event);
    });
  }

  getTotalViolationsCountByType(type) {
    return this.violationEvents.filter((violation) => violation.type === type).length;
  }

  getTotalViolationsCount() {
    return this.violationEvents.length;
  }

  getAllViolations() {
    return this.violationEvents;
  }

  getViolationsCountForDisqualify() {
    return this.violationEvents.filter((violation) => violation.disqualify === true).length;
  }

  _cleanup() {
    this.sendEvents();
    this.stopCompatibilityChecks();
  }
}
