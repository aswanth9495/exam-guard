/* eslint-disable no-else-return */
async function parseJsonResponse(response) {
  let json = null;
  try {
    json = await response.json();
  } catch (e) {
    // TODO
  }

  if (response.ok) {
    return json;
  } else {
    const error = new Error(response.statusText);
    error.isFromServer = true;
    error.response = response;
    error.responseJson = json;

    throw error;
  }
}

export default async function request(method, path, body = null, options = {}) {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  const defaultOptions = { method };
  if (options.dataType === 'FormData') {
    delete defaultHeaders['Content-Type'];
    defaultOptions.body = body;
  } else if (body && method !== 'GET') {
    defaultOptions.body = JSON.stringify(body);
  }
  const { headers, params, ...remainingOptions } = options;
  const finalOptions = Object.assign(
    defaultOptions,
    { headers: Object.assign(defaultHeaders, headers) },
    { credentials: 'same-origin' },
    remainingOptions,
  );
  const response = await fetch(path, finalOptions);
  return parseJsonResponse(response);
}
