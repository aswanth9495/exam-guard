import { VIOLATIONS } from '../constants';

export default function detectCtrlShiftI(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyI' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlShiftI);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
