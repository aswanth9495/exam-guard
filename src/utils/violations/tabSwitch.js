import { VIOLATIONS } from '../constants';
import { getIsBrowserBlurred } from './browserBlur';

let visibilityChangeHandler = null;

export default function detectTabSwitch(handleViolation) {
  visibilityChangeHandler = () => {
    if (document.hidden && !getIsBrowserBlurred()) {
      handleViolation(VIOLATIONS.tabSwitch);
    }
  };
  document.addEventListener('visibilitychange', visibilityChangeHandler);
}
