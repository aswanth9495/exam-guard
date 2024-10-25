import { VIOLATIONS } from './constants';
import blockerTemplate from '../templates/fullScreenBlocker.html';

export function requestFullScreen() {
  const docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  }
}

export function requestExitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

export function isFullScreen() {
  return document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement;
}

// Set up the fullscreen blocker UI
function setupFullScreenBlocker() {
  const fullScreenBlocker = document.getElementById('fullscreenBlocker');
  if (!fullScreenBlocker) {
    const con = document.createElement('div');
    con.innerHTML = blockerTemplate;
    document.body.appendChild(con);
  }
}

export function addFullscreenKeyboardListener() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'F11') {
      event.preventDefault();
      if (!isFullScreen()) {
        requestFullScreen();
      } else {
        requestExitFullscreen();
      }
    } else if (!isFullScreen() && (event.key === 'Enter' || event.key === 'Return')) {
      requestFullScreen();
      const fullScreenBlocker = document.getElementById('fullscreenBlocker');

      if (fullScreenBlocker) {
        fullScreenBlocker.style.display = 'none';
      }
    }
  });
}

// Shows the initial fullscreen message
export function showFullScreenInitialMessage() {
  if (isFullScreen()) return;
  setupFullScreenBlocker();
  const fullScreenBlocker = document.getElementById('fullscreenBlocker');
  const enterFullScreenMessage = document.getElementById('fullscreen-initial-message');
  const exitFullScreenMessage = document.getElementById('fullscreen-default-message');

  if (enterFullScreenMessage && exitFullScreenMessage) {
    fullScreenBlocker.style.display = 'flex';
    enterFullScreenMessage.style.display = 'flex';
    exitFullScreenMessage.style.display = 'none';
  }
  addFullscreenKeyboardListener();
}

// Shows the default fullscreen message with countdown
export function showFullScreenDefaultMessage({ onExitCallback }) {
  if (isFullScreen()) return;
  const fullScreenBlocker = document.getElementById('fullscreenBlocker');
  if (!fullScreenBlocker) {
    setupFullScreenBlocker();
  }
  const enterFullScreenMessage = document.getElementById('fullscreen-initial-message');
  const exitFullScreenMessage = document.getElementById('fullscreen-default-message');
  const timerCountElement = document.getElementById('fullscreen-blocker-timer-count');
  const circleAnimation = document.getElementById('fullscreen-blocker-timer-circle');
  let timerCount = 10;
  let countdownInterval = null;

  if (enterFullScreenMessage && exitFullScreenMessage) {
    fullScreenBlocker.style.display = 'flex';
    enterFullScreenMessage.style.display = 'none';
    exitFullScreenMessage.style.display = 'flex';
    countdownInterval = setInterval(() => {
      timerCountElement.textContent = timerCount;

      const offset = (timerCount / 10) * 440;
      circleAnimation.style.strokeDashoffset = `${offset}`;

      if (timerCount <= 0) {
        clearInterval(countdownInterval);
        if (typeof onExitCallback === 'function') {
          onExitCallback(VIOLATIONS.fullScreen);
        }
      }
      timerCount -= 1;
    }, 1000);
  }
  addFullscreenKeyboardListener();
}

// Detect fullscreen state changes and call appropriate callbacks
export function detectFullScreen({ onFullScreenEnabled, onFullScreenDisabled }) {
  if (!isFullScreen()) {
    onFullScreenDisabled();
  } else {
    onFullScreenEnabled();
  }

  function handleFullScreenChange() {
    if (!isFullScreen()) {
      onFullScreenDisabled();
    } else {
      onFullScreenEnabled();
    }
  }

  document.addEventListener('fullscreenchange', handleFullScreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
  document.addEventListener('mozfullscreenchange', handleFullScreenChange);
  document.addEventListener('MSFullscreenChange', handleFullScreenChange);
}
