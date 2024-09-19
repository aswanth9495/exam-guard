import { VIOLATIONS } from '../constants';

export default function detectCmdH(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyH' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdH);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
