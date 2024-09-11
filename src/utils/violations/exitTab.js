import { VIOLATIONS } from '../constants';

export default function detectExitTab(handleViolation) {
  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.returnValue = '';
    handleViolation(VIOLATIONS.exitTab);
  });
}