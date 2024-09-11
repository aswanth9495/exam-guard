import { VIOLATIONS } from './constants';
import blockerTemplate from '../templates/fullScreenBlocker.html';

export function appendBlockerScreen() {
  const con = document.createElement('div');
  con.innerHTML = blockerTemplate;
  document.body.appendChild(con);
}

export function enforceFullScreen({ onExitCallback, onFullScreenEnabled, onFullScreenDisabled }) {
  const fullScreenBlocker = document.getElementById('fullscreenBlocker');
  const enterFullScreenMessage = document.getElementById('fullscreen-initial-message');
  const exitFullScreenMessage = document.getElementById('fullscreen-default-message');
  const timerCountElement = document.getElementById('fullscreen-blocker-timer-count');
  const circleAnimation = document.getElementById('fullscreen-blocker-timer-circle');
  let timerCount = 10;
  let countdownInterval = null;

  function isFullScreen() {
    return document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement;
  }

  function requestFullScreen() {
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

  function startDisqualificationCountdown() {
    timerCount = 10;
    exitFullScreenMessage.classList.remove('fullscreen-blocker__content--hidden');
    enterFullScreenMessage.classList.add('fullscreen-blocker__content--hidden');
    fullScreenBlocker.style.display = 'block';

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

  function stopDisqualificationCountdown() {
    clearInterval(countdownInterval);
    enterFullScreenMessage.classList.remove('fullscreen-blocker__content--hidden');
    exitFullScreenMessage.classList.add('fullscreen-blocker__content--hidden');
    fullScreenBlocker.style.display = 'none';
  }

  function handleFullScreenChange() {
    if (!isFullScreen()) {
      fullScreenBlocker.style.display = 'block';
      startDisqualificationCountdown();
      onFullScreenDisabled();
    } else {
      fullScreenBlocker.style.display = 'none';
      stopDisqualificationCountdown();
      onFullScreenEnabled();
    }
  }

  document.addEventListener('fullscreenchange', handleFullScreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
  document.addEventListener('mozfullscreenchange', handleFullScreenChange);
  document.addEventListener('MSFullscreenChange', handleFullScreenChange);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === 'Return') {
      requestFullScreen();
    }
  });
}
