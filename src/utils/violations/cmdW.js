import { VIOLATIONS } from '../constants';

export default function detectCmdW(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyW' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdW);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
