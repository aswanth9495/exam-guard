/* eslint-disable prefer-promise-reject-errors */
import { setupAlert, showViolationWarning, closeModal } from './utils/alert';
import {
  DEFAULT_SCREENSHOT_RESIZE_OPTIONS,
  DEFAULT_SNAPSHOT_RESIZE_OPTIONS,
  MAX_EVENTS_BEFORE_SEND,
  SNAPSHOT_SCREENSHOT_FREQUENCY,
  VIOLATIONS,
  DEFAULT_HEADERS_CONTENT_TYPE,
} from './utils/constants';
import {
  dispatchGenericViolationEvent,
  dispatchViolationEvent,
} from './utils/events';
import {
  addFullscreenKeyboardListener,
  detectFullScreen,
  isFullScreen,
  requestFullScreen,
} from './utils/fullScreenBlocker';
import { sendCompatibilityEvents } from './utils/compatibility';
// import {
//   hideCompatibilityModal,
//   setupCompatibilityCheckModal,
//   showCompatibilityCheckModal,
// } from './utils/compatibilityModal';
import { checkBandwidth } from './utils/network';
import {
  // screenshareClickHandler,
  screenshareRequestHandler,
  isScreenShareValid,
  screenshareCleanup,
  // setScreenShareQueueManager,
} from './utils/screenshotV2';
import detectBrowserBlur from './utils/violations/browserBlur';
import detectCopyPasteCut from './utils/violations/copyPasteCut';
import detectExitTab from './utils/violations/exitTab';
import detectRestrictedKeyEvents from './utils/violations/restrictedKeyEvent';
import detectRightClickDisabled from './utils/violations/rightClick';
import detectTabSwitch from './utils/violations/tabSwitch';
import preventTextSelection from './utils/violations/textSelection';
import {
  detectCtrlShiftI,
  detectAltTab,
  detectCmdH,
  detectCmdM,
  detectCtrlW,
  detectCmdW,
  detectCtrlQ,
  detectCtrlShiftC,
  detectCtrlShiftJ,
  detectCmdQ,
} from './utils/violations/keyEvents';

import {
  detectWebcam,
  setupSnapshotCapture,
  setupWebcam,
  getAvailableCameras,
} from './utils/webcam';

import './assets/styles/alert.scss';
import './assets/styles/fullScreenBlocker.scss';
import './assets/styles/compatibility-modal.scss';
import './assets/styles/webcam-blocker.scss';
import { checkMobilePairingStatus } from './utils/mobilePairing';
import { getBrowserInfo } from './utils/browser';
import { getIndexDbBufferInstance } from './utils/indexDbBuffer';

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
    // mockModeEnabled = false,
    mobilePairingConfig = {},
    qrCodeConfig = {},
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
      frequency: 10000,
      maxFrequency: 60000,
      cpuThreshold: 30, // Common CPU threshold in case of network latency test
      disqualificationTimeout: 45000,
      memoryLimit: 200,
      showTimer: true,
      buttonText: 'Confirm Settings',
      headingText: 'System Check: Configure Required Settings',
      defaultPayload: {},
      endpoint: '',
      baseUrl: '',
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
    this.mobilePairingConfig = {
      enabled: false,
      defaultPayload: {},
      endpoint: '',
      baseUrl: '',
      ...mobilePairingConfig,
    };
    this.qrCodeConfig = {
      defaultPayload: {},
      endpoint: '',
      baseUrl: '',
      ...qrCodeConfig,
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
        showAlert: false,
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
      [VIOLATIONS.screenshareExit]: {
        name: VIOLATIONS.screenshareExit,
        enabled: true,
        showAlert: enableAllAlerts,
        recordViolation: true,
        disqualify: true,
        ...config.screenshareExit,
      },
    };
    this.snapshotConfig = {
      enabled: false,
      frequency: SNAPSHOT_SCREENSHOT_FREQUENCY, // 5s by default
      resizeTo: DEFAULT_SNAPSHOT_RESIZE_OPTIONS,
      optional: false,
      deviceId: null,
      ...snapshotConfig,
    };
    this.screenshotConfig = {
      enabled: true,
      frequency: SNAPSHOT_SCREENSHOT_FREQUENCY,
      resizeTo: DEFAULT_SCREENSHOT_RESIZE_OPTIONS,
      ...screenshotConfig,
    };
    this.callbacks = {
      onDisqualified: callbacks.onDisqualified || (() => { }),
      onWebcamDisabled: callbacks.onWebcamDisabled || (() => { }),
      onWebcamEnabled: callbacks.onWebcamEnabled || (() => { }),
      onSnapshotSuccess: callbacks.onSnapshotSuccess || (() => { }),
      onSnapshotFailure: callbacks.onSnapshotFailure || (() => { }),
      onScreenShareSuccess: callbacks.onScreenShareSuccess || (() => { }),
      onScreenShareFailure: callbacks.onScreenShareFailure || (() => { }),
      onScreenShareEnd: callbacks.onScreenShareEnd || (() => { }),
      onScreenshotFailure: callbacks.onScreenshotFailure || (() => { }),
      onScreenshotSuccess: callbacks.onScreenshotSuccess || (() => { }),
      onFullScreenEnabled: callbacks.onFullScreenEnabled || (() => { }),
      onFullScreenDisabled: callbacks.onFullScreenDisabled || (() => { }),
      onCompatibilityCheckSuccess:
        callbacks.onCompatibilityCheckSuccess || (() => { }),
      onCompatibilityCheckFail:
        callbacks.onCompatibilityCheckFail || (() => { }),
    };
    this.violationEvents = [];
    this.recordedViolationEvents = []; // Store events for batch sending
    this.failedCompatibilityChecks = false; // To track if checks have failed
    this.compatibilityCheckInterval = null;
    this.initializeProctoring = this.initializeProctoring.bind(this);
    this.runCompatibilityChecks = this.runCompatibilityChecks.bind(this);
    this.startCompatibilityChecks = this.startCompatibilityChecks.bind(this);
    this.runAdaptiveCompatibilityChecks = this.runAdaptiveCompatibilityChecks.bind(this);
    this.initialFullScreen = false;
    setupAlert();
    if (this.snapshotConfig.enabled) {
      setupWebcam();
    }
    addFullscreenKeyboardListener();
    this.queueManager = getIndexDbBufferInstance(
      {
        screenshot: (data) => this.callbacks.onScreenshotSuccess(data),
        webcam: (data) => this.callbacks.onSnapshotSuccess(data),
      },
      {
        networkCheckInterval: 5000,
      },
    );
    // setScreenShareQueueManager(this.queueManager);
    // setupCompatibilityCheckModal(
    //   () => {
    //     this.runCompatibilityChecks(
    //       this.handleCompatibilitySuccess.bind(this),
    //       this.handleCompatibilityFailure.bind(this),
    //     );
    //     if (this.proctoringInitialised && !isFullScreen()) {
    //       requestFullScreen();
    //     }
    //   },
    //   { ...this.compatibilityCheckConfig, mockModeEnabled },
    // );

    // if (this.screenshotConfig.enabled) {
    //   this.handleScreenshareClick();
    // }
  }

  async initializeProctoring() {
    this.proctoringInitialised = true;

    if (this.screenshotConfig.enabled) {
      await this.handleScreenshareRequest();
    }

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
      detectWebcam({
        onWebcamEnabled: this.handleWebcamEnabled.bind(this),
        onWebcamDisabled: this.handleWebcamDisabled.bind(this),
        optional: this.snapshotConfig.optional,
        deviceId: this.snapshotConfig.deviceId,
      });
    }

    // Listen to tab close or exit
    this.handleWindowUnload();
    this.startCompatibilityChecks();
  }

  startCompatibilityChecks() {
    console.log('%c⧭', 'color: #731d6d', 'Starting Comp checks');
    if (!this.compatibilityCheckConfig.enable) return;

    this.compatibilityCheckInterval = setInterval(() => {
      this.runAdaptiveCompatibilityChecks();
    }, this.compatibilityCheckConfig.frequency);
  }

  runAdaptiveCompatibilityChecks() {
    clearInterval(this.compatibilityCheckInterval);

    const start = performance.now();
    // MB (adjust this as per your requirement)
    const { memoryLimit } = this.compatibilityCheckConfig;

    // Check memory usage via the browser's Performance API (for browsers that support it)
    const memoryUsage = window.performance && window.performance.memory
      ? window.performance.memory.usedJSHeapSize / 1024 / 1024 // in MB
      : 0; // If memory data is not available, assume 0 (safe fallback)

    console.log('%c%s', 'color: #ff2525', 'Memory Usage (in MB):', memoryUsage);

    if (memoryUsage < memoryLimit) {
      // Run compatibility checks (e.g., webcam, network speed, etc.)
      this.runCompatibilityChecks(
        this.handleCompatibilitySuccess.bind(this),
        this.handleCompatibilityFailure.bind(this),
      );
    }

    const duration = performance.now() - start;

    /* Debugging logs */
    console.log(
      '%c%s',
      'color: #ff2525',
      'Time take for running Compatibility checks (in ms):',
      duration,
    );

    console.log(
      '%c%s',
      'color: #ff2525',
      'Is CPU peformance fine ?: ',
      duration < this.compatibilityCheckConfig.cpuThreshold,
    );

    // Adjust frequency based on system load
    const delay = duration < this.compatibilityCheckConfig.cpuThreshold
      ? this.compatibilityCheckConfig.frequency
      : this.compatibilityCheckConfig.maxFrequency;

    // Set up a new interval with the updated frequency
    this.compatibilityCheckInterval = setInterval(() => {
      this.runAdaptiveCompatibilityChecks();
    }, delay);
  }

  handleCompatibilitySuccess(passedChecks) {
    console.log('%c⧭', 'color: #006dcc', 'Compatibility Passed, checks: ', passedChecks);
    sendCompatibilityEvents(
      passedChecks,
      this.compatibilityCheckConfig.baseUrl,
      this.compatibilityCheckConfig.endpoint,
      this.compatibilityCheckConfig.defaultPayload,
    );
    this.callbacks.onCompatibilityCheckSuccess({ passedChecks });
  }

  handleCompatibilityFailure(passedChecks) {
    console.log('%c⧭', 'color: #d90000', 'Compatibility Failed, checks: ', passedChecks);
    sendCompatibilityEvents(
      passedChecks,
      this.compatibilityCheckConfig.baseUrl,
      this.compatibilityCheckConfig.endpoint,
      this.compatibilityCheckConfig.defaultPayload,
    );
    this.callbacks.onCompatibilityCheckFail({ passedChecks });
  }

  stopCompatibilityChecks() {
    if (this.compatibilityCheckInterval) {
      clearInterval(this.compatibilityCheckInterval);
    }
  }

  checkMobileCompatiblity({ onSuccess, onFailure }) {
    checkMobilePairingStatus({
      baseUrl: this.mobilePairingConfig.baseUrl,
      endpoint: this.mobilePairingConfig.endpoint,
      defaultPayload: this.mobilePairingConfig.defaultPayload,
      onSuccess,
      onFailure,
    });
  }

  runCompatibilityChecks(onSuccess, onFailure) {
    console.log('%c⧭', 'color: #807160', 'RUNNING COMPATIBILITY CHECKS');
    const compatibilityChecks = {
      screenshare: this.screenshotConfig.enabled,
      webcam: this.snapshotConfig.enabled,
      networkSpeed:
        this.snapshotConfig.enabled || this.screenshotConfig.enabled,
      fullscreen: this.config[VIOLATIONS.fullScreen].enabled,
      browser: true,
      mobileSnapshot: this.mobilePairingConfig.enabled,
      mobileBattery: this.mobilePairingConfig.enabled,
      mobileSetup: this.mobilePairingConfig.enabled,
    };

    // Initialize object to store the result of passed checks
    const passedChecks = {
      screenshare: false,
      webcam: false,
      mobileSnapshot: false,
      mobileBattery: false,
      mobileSetup: false,
      browser: false,
      networkSpeed: false,
      fullscreen: false,
    };

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
            passedChecks.webcam = true; // Update passed checks
            resolve('webcam');
          },
        });
      });
      compatibilityPromises.push(webcamCheck);
    }

    // Browser check
    const browserCheck = new Promise((resolve, reject) => {
      const browserInfo = getBrowserInfo();
      if (!browserInfo.isSupported) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('browser');
      } else {
        passedChecks.browser = true;
        resolve('browser');
      }
    });
    compatibilityPromises.push(browserCheck);

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

    if (compatibilityChecks.screenshare) {
      const screenshareCheck = new Promise((resolve, reject) => {
        isScreenShareValid({
          onSuccess: () => {
            passedChecks.screenshare = true;
            resolve('screenshare');
          },
          onFailure: (error) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('screenshare');
            console.warn(error);
          },
        });
      });
      compatibilityPromises.push(screenshareCheck);
    }

    if (compatibilityChecks.mobileBattery
      || compatibilityChecks.mobileSetup
      || compatibilityChecks.mobileSnapshot) {
      const mobilePairingCheck = new Promise((resolve, reject) => {
        this.checkMobileCompatiblity({
          onSuccess: (data) => {
            if (data.success) {
              passedChecks.mobileBattery = true;
              passedChecks.mobileSnapshot = true;
              passedChecks.mobileSetup = true;
              resolve({ success: true, checks: passedChecks });
            } else {
              const secondaryCameraChecks = data.checks?.secondary_camera.checks;
              Object.keys(secondaryCameraChecks).forEach((check) => {
                const checkData = secondaryCameraChecks[check];
                switch (check) {
                  case 'setup':
                    passedChecks.mobileSetup = checkData?.success || false;
                    break;
                  case 'snapshot':
                    passedChecks.mobileSnapshot = checkData?.success || false;
                    break;
                  case 'battery':
                    passedChecks.mobileBattery = checkData?.success || false;
                    break;
                  default:
                    break;
                }
              });
              reject({ success: false, checks: passedChecks });
            }
          },
          onFailure: () => {
            passedChecks.mobileBattery = false;
            passedChecks.mobileSnapshot = false;
            passedChecks.mobileSetup = false;
            reject({ success: false, checks: passedChecks });
          },
        });
      });
      compatibilityPromises.push(mobilePairingCheck);
    }

    // Wait for all compatibility checks to complete
    Promise.allSettled(compatibilityPromises)
      .then((results) => {
        // If any check fails, handle failure and return the updated object
        const failedCheck = results.find(
          (result) => result.status === 'rejected',
        );

        if (failedCheck) {
          if (this.compatibilityCheckConfig.showAlert) {
            /* TODO: Remove the code to show comp modal  */
            // showCompatibilityCheckModal(
            //   passedChecks,
            //   compatibilityChecks,
            //   () => {
            //     this.disqualifyUser();
            //   },
            //   this.proctoringInitialised
            //     && this.compatibilityCheckConfig.showTimer,
            // );
          }
          onFailure?.(passedChecks);
        } else {
          /* TODO: Remove the code to hide comp modal  */
          // hideCompatibilityModal();
          closeModal();
          this.failedCompatibilityChecks = false;
          onSuccess?.(passedChecks);
        }
      })
      .catch(() => {
        /* TODO: Remove the code to show comp modal  */
        // showCompatibilityCheckModal(
        //   passedChecks,
        //   compatibilityChecks,
        //   () => {
        //     this.disqualifyUser();
        //   },
        //   this.proctoringInitialised,
        // );
        // Handle any failure in individual checks
        onFailure?.(passedChecks);
      });

    // console.table(passedChecks);
  }

  handleWebcamDisabled({ error }) {
    this.callbacks.onWebcamDisabled({ error });
  }

  handleScreenshotDisabled() {
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

  handleScreenShareSuccess() {
    this.callbacks.onScreenShareSuccess();
    this.enableFullScreen();
  }

  handleScreenShareFailure(errorCode) {
    this.callbacks.onScreenShareFailure(errorCode);
  }

  handleScreenShareEnd() {
    this.handleViolation(VIOLATIONS.screenshareExit);
    this.callbacks.onScreenShareEnd();
  }

  handleScreenshotSuccess({ blob }) {
    this.callbacks.onScreenshotSuccess({ blob });
  }

  handleSnapshotSuccess({ blob }) {
    this.callbacks.onSnapshotSuccess({ blob });
  }

  // handleScreenshareClick() {
  //   screenshareClickHandler.bind(this)({
  //     onClick: () => {
  //       screenshareRequestHandler.bind(this)();
  //     },
  //   });
  // }

  async handleScreenshareRequest() {
    await screenshareRequestHandler.bind(this)();
  }

  handleWebcamRequest() {
    detectWebcam({
      onWebcamEnabled: this.handleWebcamEnabled.bind(this),
      onWebcamDisabled: this.handleWebcamDisabled.bind(this),
      optional: this.snapshotConfig.optional,
      deviceId: this.snapshotConfig.deviceId,
    });
  }

  async getWebcamDevices() {
    return getAvailableCameras.bind(this)();
  }

  setWebcamDevice(deviceId) {
    this.snapshotConfig.deviceId = deviceId;
  }

  handleScreenshotFailure() {
    this.callbacks.onScreenshotFailure();
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
    this.callbacks.onFullScreenEnabled();
  }

  handleCompatibilityChecks({ forceRun = false } = {}) {
    if (!this.proctoringInitialised || forceRun) {
      this.runCompatibilityChecks(
        this.handleCompatibilitySuccess.bind(this),
        this.handleCompatibilityFailure.bind(this),
      );
    }
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

    if (
      forceDisqualify
      || this.getViolationsCountForDisqualify()
      >= this.disqualificationConfig.eventCountThreshold
    ) {
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
    if (
      this.recordedViolationEvents.length
      >= this.eventsConfig.maxEventsBeforeSend
    ) {
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
    })
      .then(() => {
        this.recordedViolationEvents = [];
      })
      .catch((error) => {
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
    return this.violationEvents.filter((violation) => violation.type === type)
      .length;
  }

  getTotalViolationsCount() {
    return this.violationEvents.length;
  }

  getAllViolations() {
    return this.violationEvents;
  }

  getViolationsCountForDisqualify() {
    return this.violationEvents.filter(
      (violation) => violation.disqualify === true,
    ).length;
  }

  _cleanup() {
    this.sendEvents();
    this.stopCompatibilityChecks();
    screenshareCleanup();
    this.queueManager.cleanup();
  }

  handleCleanup() {
    console.log('cleanup');
    this._cleanup();
  }
}
