import { VIOLATIONS } from '../constants';
import beep from '../../assets/sound/beep.wav';

const beepSound = new Audio(beep);
let beepInterval = null;
let disqualificationTimeout = null;
let violationTimeout = null;
let isBrowserBlurred = false;

export function getIsBrowserBlurred() {
  return isBrowserBlurred;
}

export function setIsBrowserBlurred(value) {
  isBrowserBlurred = value;
}

export default function detectBrowserBlur(
  handleViolation,
  onDisqualify,
  beepTime,
  disqualifyAfter,
  violationAfter,
  disqualificationEnabled = false,
) {
  window.addEventListener('blur', () => {
    setIsBrowserBlurred(true);
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
      setIsBrowserBlurred(false);
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
