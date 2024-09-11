import { VIOLATIONS } from '../constants';

export default function detectCopyPasteCut(handleViolation) {
  function handleEvent(event) {
    if ((event.ctrlKey || event.metaKey)
        && (event.key === 'c'
        || event.key === 'x'
        || event.key === 'v')) {
      event.preventDefault();
      handleViolation(VIOLATIONS.copyPasteCut);
    } else if ((event.ctrlKey || event.metaKey)
        && event.key === 'V' && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.copyPasteCut);
    }
  }

  function handleCutCopy(event) {
    event.preventDefault();
    handleViolation(VIOLATIONS.copyPasteCut);
  }

  function handlePaste(event) {
    event.preventDefault();
    handleViolation(VIOLATIONS.copyPasteCut);
  }

  window.addEventListener('keydown', handleEvent);
  window.addEventListener('cut', handleCutCopy);
  window.addEventListener('copy', handleCutCopy);
  window.addEventListener('paste', handlePaste);

  return () => {
    window.removeEventListener('keydown', handleEvent);
    window.removeEventListener('cut', handleCutCopy);
    window.removeEventListener('copy', handleCutCopy);
    window.removeEventListener('paste', handlePaste);
  };
}
