import { VIOLATIONS } from '../constants';

export default function detectCtrlShiftJ(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyJ' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlShiftJ);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
