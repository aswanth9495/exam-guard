// eslint-disable-next-line import/prefer-default-export
export const VIOLATIONS = {
  tabSwitch: 'tabSwitch',
  browserBlur: 'browserBlur',
  rightClick: 'rightClick',
  exitTab: 'exitTab',
  copyPasteCut: 'copyPasteCut',
  restrictedKeyEvent: 'restrictedKeyEvent',
  textSelection: 'textSelection',
  fullScreen: 'fullScreen',
};
export const SNAPSHOT_SCREENSHOT_FREQUENCY = 5000;
export const DEFAULT_SNAPSHOT_RESIZE_OPTIONS = { width: 160, height: 120 };
export const DEFAULT_SCREENSHOT_RESIZE_OPTIONS = { width: 480, height: 270 };
export const DEFAULT_MODAL_CONFIG = {
  buttonText: 'Continue',
  headingText: 'Compatibility check: Ensure the following below',
};
export const MAX_EVENTS_BEFORE_SEND = 5;
