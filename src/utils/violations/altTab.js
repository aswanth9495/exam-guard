import { VIOLATIONS } from '../constants';

export default function detectAltTab(handleViolation) {
  function handleKeyDown(event) {
    if (event.code.toLowerCase() === 'tab' && (event.altKey || event.metaKey)) {
      event.preventDefault();
      handleViolation(VIOLATIONS.altTab);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
