/**
 * Dispatches a custom event with the given type and violation details.
 * @param {string} type - The type of the event.
 * @param {Object} violation - The violation details.
 */
function dispatchCustomEvent(type, violation) {
  const event = new CustomEvent(type, {
    detail: { violation },
  });
  document.dispatchEvent(event);
}

export {
  // Disabled because there can be more methods in future
  // eslint-disable-next-line import/prefer-default-export
  dispatchCustomEvent,
};
