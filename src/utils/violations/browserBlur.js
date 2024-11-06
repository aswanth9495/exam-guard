import { VIOLATIONS, BROWSER_BLUR_WARNING } from '../constants';
import { showViolationWarning } from '../alert';
import beep from '../../assets/sound/beep.wav';

const beepSound = new Audio(beep);
let beepInterval = null;
let disqualificationTimeout = null;
let violationInterval = null;

export default function detectBrowserBlur(
  handleViolation,
  onDisqualify,
  beepTime,
  disqualifyAfter,
  disqualificationEnabled = false,
) {
  window.addEventListener('blur', () => {
    handleViolation(VIOLATIONS.browserBlur, false);
    showViolationWarning('WARNING', BROWSER_BLUR_WARNING);
    if (!beepInterval && disqualificationEnabled) {
      beepInterval = setInterval(() => {
        beepSound.play();
      }, beepTime);
      disqualificationTimeout = setTimeout(() => {
        onDisqualify();
      }, disqualifyAfter);
      violationInterval = setInterval(() => {
        handleViolation(VIOLATIONS.browserBlur, false);
      }, 5000);
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
      if (violationInterval) {
        clearInterval(violationInterval);
        violationInterval = null;
      }
    });
  });
}
