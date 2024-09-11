import { VIOLATIONS } from '../constants';

export default function detectRightClickDisabled(handleViolation) {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    handleViolation(VIOLATIONS.rightClick);
  });
}
