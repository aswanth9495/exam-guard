export const checkMobilePairingStatus = async ({
  baseUrl, endpoint, defaultPayload,
  onSuccess, onFailure,
}) => {
  try {
    const url = new URL(endpoint, baseUrl);
    url.search = new URLSearchParams({ ...defaultPayload }).toString();

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pollingData = await response.json(); // Await the JSON parsing
    onSuccess?.(pollingData);
  } catch (e) {
    onFailure?.(e);
  }
};
