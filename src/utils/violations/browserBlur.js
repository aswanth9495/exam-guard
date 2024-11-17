import { VIOLATIONS } from '../constants';
import beep from '../../assets/sound/beep.wav';
import { removeTabSwitch, detectTabSwitch } from './tabSwitch';

const beepSound = new Audio(beep);
let beepInterval = null;
let disqualificationTimeout = null;
let violationTimeout = null;

export default function detectBrowserBlur(
  handleViolation,
  onDisqualify,
  beepTime,
  disqualifyAfter,
  violationAfter,
  disqualificationEnabled = false,
  isTabSwitchEnabled = false,
) {
  window.addEventListener('blur', () => {
    if (isTabSwitchEnabled) removeTabSwitch();
    violationTimeout = setTimeout(() => {
      handleViolation(VIOLATIONS.browserBlur, false);
    }, violationAfter);
    if (!beepInterval && disqualificationEnabled) {
      beepInterval = setInterval(() => {
        beepSound.play();
      }, beepTime);
      disqualificationTimeout = setTimeout(() => {
        onDisqualify();
      }, disqualifyAfter);
    }
    window.addEventListener('focus', () => {
      if (isTabSwitchEnabled) detectTabSwitch(handleViolation);
      if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
      }
      if (disqualificationTimeout) {
        clearTimeout(disqualificationTimeout);
        disqualificationTimeout = null;
      }
      if (violationTimeout) {
        clearTimeout(violationTimeout);
        violationTimeout = null;
      }
    });
  });
}
