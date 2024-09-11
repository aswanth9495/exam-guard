import { VIOLATIONS } from '../constants';

const RESTRICTED_KEY_EVENTS = [
  { code: 'Tab', modifiers: ['Alt'], eventType: 'alt_tab' },
  { code: 'Tab', modifiers: ['Meta'], eventType: 'meta_tab' },
  { code: 'KeyI', modifiers: ['Control', 'Shift'], eventType: 'ctrl_shift_i' },
  { code: 'KeyQ', modifiers: ['Control'], eventType: 'ctrl_q' },
  { code: 'KeyW', modifiers: ['Control'], eventType: 'ctrl_w' },
  { code: 'KeyC', modifiers: ['Control', 'Shift'], eventType: 'ctrl_shift_c' },
  { code: 'KeyI', modifiers: ['Meta', 'Alt'], eventType: 'ctrl_shift_i' },
  { code: 'KeyC', modifiers: ['Meta', 'Shift'], eventType: 'ctrl_shift_c' },
  { code: 'KeyJ', modifiers: ['Control', 'Shift'], eventType: 'ctrl_shift_j' },
  { code: 'KeyJ', modifiers: ['Meta', 'Alt'], eventType: 'ctrl_shift_j' },
  { code: 'KeyM', modifiers: ['Meta'], eventType: 'cmd_m' },
  { code: 'KeyH', modifiers: ['Meta'], eventType: 'cmd_h' },
  { code: 'KeyW', modifiers: ['Meta'], eventType: 'cmd_w' },
  { code: 'KeyQ', modifiers: ['Meta'], eventType: 'cmd_q' },
];

export default function detectRestrictedKeyEvents(handleViolation) {
  function handleKeyDown(event) {
    const {
      code, metaKey, ctrlKey, altKey, shiftKey,
    } = event;

    RESTRICTED_KEY_EVENTS.forEach((shortcut) => {
      const { code: shortcutCode, modifiers, eventType } = shortcut;

      const isKeyMatch = code === shortcutCode;

      const areModifiersMatch = modifiers.every((modifier) => {
        switch (modifier.toLowerCase()) {
          case 'meta':
            return metaKey;
          case 'control':
            return ctrlKey;
          case 'alt':
            return altKey;
          case 'shift':
            return shiftKey;
          default:
            return false;
        }
      });

      if (isKeyMatch && areModifiersMatch) {
        event.preventDefault();
        handleViolation(VIOLATIONS.restrictedKeyEvent, eventType);
      }
    });
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
