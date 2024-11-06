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
  ctrlShiftI: 'ctrlShiftI',
  ctrlShiftC: 'ctrlShiftC',
  altTab: 'altTab',
  ctrlQ: 'ctrlQ',
  ctrlW: 'ctrlW',
  cmdM: 'cmdM',
  cmdH: 'cmdH',
  cmdW: 'cmdW',
  cmdQ: 'cmdQ',
  ctrlShiftJ: 'ctrlShiftJ',
};
export const SNAPSHOT_SCREENSHOT_FREQUENCY = 5000;
export const DEFAULT_SNAPSHOT_RESIZE_OPTIONS = { width: 480, height: 360 };
export const DEFAULT_SCREENSHOT_RESIZE_OPTIONS = { width: 480, height: 270 };
export const MAX_EVENTS_BEFORE_SEND = 5;
export const DEFAULT_HEADERS_CONTENT_TYPE = 'application/x-www-form-urlencoded';
export const BROWSER_BLUR_WARNING = 'Your test screen is not in focus. Please do not change your window or move your cursor outside the test screen. Doing so will lead to disqualification';
