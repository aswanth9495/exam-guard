export function detectMic({
  onMicEnabled,
  onMicDisabled,
  optional,
}) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      onMicEnabled?.({ stream }); // Call the callback when the mic is successfully enabled.
    })
    .catch((error) => {
      if (optional) {
        if (error.name !== 'NotFoundError') onMicDisabled?.({ error });
      } else {
        onMicDisabled?.({ error });
      }
    });
}
