import { VIOLATIONS } from '../constants';

export default function detectCmdQ(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyQ' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdQ);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
