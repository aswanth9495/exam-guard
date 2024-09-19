import { VIOLATIONS } from '../constants';

export default function detectCtrlQ(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyQ' && event.ctrlKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlQ);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
