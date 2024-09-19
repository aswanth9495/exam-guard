import { VIOLATIONS } from '../constants';

export default function detectCtrlShiftC(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlShiftC);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
