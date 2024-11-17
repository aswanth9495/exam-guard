import { VIOLATIONS } from '../constants';

let visibilityChangeHandler = null;

export function detectTabSwitch(handleViolation) {
  visibilityChangeHandler = () => {
    if (document.hidden) {
      handleViolation(VIOLATIONS.tabSwitch);
    }
  };
  document.addEventListener('visibilitychange', visibilityChangeHandler);
}

export function removeTabSwitch() {
  if (visibilityChangeHandler) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
    visibilityChangeHandler = null;
  }
}
