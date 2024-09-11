import { dispatchCustomEvent } from './utils/events';
import { setupAlert, showViolationWarning } from './utils/alert';
import { appendBlockerScreen, enforceFullScreen } from './utils/fullScreenBlocker';
import { initializeModal } from './utils/instructionModal';
import { setupWebcam } from './utils/webcam';
import detectTabSwitch from './utils/violations/tabSwitch';
import detectBrowserBlur from './utils/violations/browserBlur';
import detectRightClickDisabled from './utils/violations/rightClick';
import detectExitTab from './utils/violations/exitTab';
import detectCopyPasteCut from './utils/violations/copyPasteCut';
import detectRestrictedKeyEvents from './utils/violations/restrictedKeyEvent';
import preventTextSelection from './utils/violations/textSelection';
import { VIOLATIONS, DEFAULT_SNAPSHOT_FREQUENCY } from './utils/constants';

import './assets/styles/alert.scss';
import './assets/styles/fullScreenBlocker.scss';
import './assets/styles/instructionModal.scss';

export default class Proctor {
  constructor({
    instructionModal = {},
    eventsUrl,
    config,
    apiKey,
    s3StoreConfig,
    snapshotConfig,
    callbacks = {},

  }) {
    this.instructionModal = {
      enabled: true,
      ...instructionModal,
    };
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
      frequency: DEFAULT_SNAPSHOT_FREQUENCY, // 5s by default
      optional: true,
      ...snapshotConfig,
    };
    this.callbacks = {
      onWebcamDisabled: callbacks.onWebcamDisabled || (() => {}),
      onWebcamEnabled: callbacks.onWebcamEnabled || (() => {}),
      onSnapshotSuccess: callbacks.onSnapshotSuccess || (() => {}),
      onSnapshotFailure: callbacks.onSnapshotFailure || (() => {}),
      onFullScreenEnabled: callbacks.onFullScreenEnabled || (() => {}),
      onFullScreenDisabled: callbacks.onFullScreenDisabled || (() => {}),
    };
    this.violationEvents = [];
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

  handleFullScreenDisabled() {
    this.callbacks.onFullScreenDisabled();
  }

  handleFullScreenEnabled() {
    this.callbacks.onFullScreenEnabled();
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
