export const sendCompatibilityEvents = (passedChecks, baseUrl, endpoint, defaultPayload = {}) => {
  const events = Object.keys(passedChecks).map((key) => ({
    type: 'desktop_client',
    name: key,
    data: {
      value: passedChecks[key],
    },
  }));

  const payload = {
    ...defaultPayload,
    events,
  };

  // Use the URL class to construct the full URL
  const url = new URL(endpoint, baseUrl);

  fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to send compatibility events to ${url}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Compatibility events sent successfully:', data);
    })
    .catch((error) => {
      console.error('Error sending compatibility events:', error);
    });
};
