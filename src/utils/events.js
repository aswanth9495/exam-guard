function dispatchViolationEvent(type, eventDetails) {
  const event = new CustomEvent(type, {
    detail: eventDetails,
  });
  document.dispatchEvent(event);
}

function dispatchGenericViolationEvent(eventDetails) {
  const event = new CustomEvent('violation', {
    detail: eventDetails,
  });
  document.dispatchEvent(event);
}
export {
  dispatchViolationEvent,
  dispatchGenericViolationEvent,
};
