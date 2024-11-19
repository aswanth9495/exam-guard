import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

class ProctorLibrary {
  static initialize(containerId, props = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }
    
    const defaultProps = {
      baseUrl: window.location.origin,
      eventsConfig: {},
      disqualificationConfig: {},
      config: {},
      snapshotConfig: {},
      screenshotConfig: {},
      compatibilityCheckConfig: {},
      callbacks: {},
      enableAllAlerts: true,
      headerOptions: {},
      mockModeEnabled: false
    };

    const root = createRoot(container);
    root.render(<App {...defaultProps} {...props} />);
  }
}

export default ProctorLibrary;