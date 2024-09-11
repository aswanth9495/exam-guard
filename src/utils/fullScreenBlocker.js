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

export function isFullScreen() {
  return document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement;
}

// Set up the fullscreen blocker UI
function setupFullScreenBlocker() {
  const con = document.createElement('div');
  con.innerHTML = blockerTemplate;
  document.body.appendChild(con);
}

export function addFullscreenKeyboardListener() {
  document.addEventListener('keydown', (event) => {
    if (!isFullScreen() && (event.key === 'Enter' || event.key === 'Return')) {
      requestFullScreen();
      const fullScreenBlocker = document.getElementById('fullscreenBlocker');

      fullScreenBlocker.style.display = 'none';
    }
  });
}

// Shows the initial fullscreen message
export function showFullScreenInitialMessage() {
  if (isFullScreen()) return;
  const fullScreenBlocker = document.getElementById('fullscreenBlocker');
  if (!fullScreenBlocker) {
    setupFullScreenBlocker();
  }
  const enterFullScreenMessage = document.getElementById('fullscreen-initial-message');
  const exitFullScreenMessage = document.getElementById('fullscreen-default-message');

  if (enterFullScreenMessage && exitFullScreenMessage) {
    enterFullScreenMessage.style.display = 'flex';
    exitFullScreenMessage.style.display = 'none';
  }
  addFullscreenKeyboardListener();
}

// Shows the default fullscreen message with countdown
export function showFullScreenDefaultMessage({ onExitCallback }) {
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

  if (fullScreenBlocker && enterFullScreenMessage && exitFullScreenMessage) {
    enterFullScreenMessage.style.display = 'flex';
    exitFullScreenMessage.style.display = 'none';
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
