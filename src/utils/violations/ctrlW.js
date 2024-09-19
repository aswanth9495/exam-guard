import { VIOLATIONS } from '../constants';

export default function detectCtrlW(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyW' && event.ctrlKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlW);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
