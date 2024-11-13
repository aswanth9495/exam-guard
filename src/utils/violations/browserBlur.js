import { VIOLATIONS, BROWSER_BLUR_WARNING } from '../constants';
import { showViolationWarning } from '../alert';
import beep from '../../assets/sound/beep.wav';

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
  showAlert = false,
  disqualificationEnabled = false,
) {
  window.addEventListener('blur', () => {
    if (!beepInterval && disqualificationEnabled) {
      beepInterval = setInterval(() => {
        beepSound.play();
      }, beepTime);
      disqualificationTimeout = setTimeout(() => {
        onDisqualify();
      }, disqualifyAfter);
      violationTimeout = setTimeout(() => {
        if (showAlert) showViolationWarning('WARNING', BROWSER_BLUR_WARNING);
        handleViolation(VIOLATIONS.browserBlur, false);
      }, violationAfter);
    }
    window.addEventListener('focus', () => {
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
