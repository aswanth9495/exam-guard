import { VIOLATIONS } from '../constants';

export default function detectCmdM(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyM' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdM);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
