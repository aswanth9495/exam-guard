import { VIOLATIONS } from '../constants';

export function detectAltTab(handleViolation) {
  function handleKeyDown(event) {
    if (event.code.toLowerCase() === 'tab' && (event.altKey || event.metaKey)) {
      event.preventDefault();
      handleViolation(VIOLATIONS.altTab);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCtrlShiftI(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyI' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlShiftI);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCmdH(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyH' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdH);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCmdM(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyM' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdM);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCmdW(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyW' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdW);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCmdQ(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyQ' && event.metaKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.cmdQ);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCtrlShiftJ(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyJ' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlShiftJ);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCtrlQ(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyQ' && event.ctrlKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlQ);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCtrlW(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyW' && event.ctrlKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlW);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function detectCtrlShiftC(handleViolation) {
  function handleKeyDown(event) {
    if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      handleViolation(VIOLATIONS.ctrlShiftC);
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
