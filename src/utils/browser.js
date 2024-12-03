/**
 * Supported browsers and their minimum versions
 */
export const SUPPORTED_BROWSERS = {
  chrome: { name: 'Chrome', minVersion: 80 },
  firefox: { name: 'Firefox', minVersion: 78 },
  edge: { name: 'Edge', minVersion: 80 },
  opera: { name: 'Opera', minVersion: 70 },
  safari: { name: 'Safari', minVersion: 14 },
};

/**
 * Detect browser using both feature detection and user agent
 * @returns {Object} Browser information
 */
export const getBrowserInfo = () => {
  const isOpera = (!!window.opr && !!window.opr.addons)
    || !!window.opera
    || navigator.userAgent.indexOf(' OPR/') >= 0;

  const isFirefox = typeof InstallTrigger !== 'undefined';

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const isEdge = navigator.userAgent.indexOf('Edg') !== -1;

  const isChrome = !!window.chrome
    && /Chrome/.test(navigator.userAgent)
    && !isEdge && !isOpera;

  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let version = 0;

  const extractVersion = (regex) => {
    const match = ua.match(regex);
    return match ? parseInt(match[1], 10) : 0;
  };

  if (isEdge) {
    browserName = 'Edge';
    version = extractVersion(/Edg\/(\d+)/);
  } else if (isFirefox) {
    browserName = 'Firefox';
    version = extractVersion(/Firefox\/(\d+)/);
  } else if (isOpera) {
    browserName = 'Opera';
    version = extractVersion(/OPR\/(\d+)/);
  } else if (isSafari) {
    browserName = 'Safari';
    version = extractVersion(/Version\/(\d+)/);
  } else if (isChrome) {
    browserName = 'Chrome';
    version = extractVersion(/Chrome\/(\d+)/);
  }

  const isSupported = Object.values(SUPPORTED_BROWSERS).some(
    (browser) => browser.name === browserName && version >= browser.minVersion,
  );

  return {
    name: browserName,
    version,
    isSupported,
  };
};
