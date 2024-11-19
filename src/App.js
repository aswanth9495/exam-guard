import React, { useEffect, useState } from 'react';

const App = ({
  baseUrl,
  eventsConfig,
  disqualificationConfig,
  config,
  snapshotConfig,
  screenshotConfig,
  compatibilityCheckConfig,
  callbacks,
  enableAllAlerts,
  headerOptions,
  mockModeEnabled
}) => {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const initializeProctoring = async () => {
      try {
        const Proctor = (await import('./proctor')).default;
        const proctor = new Proctor({
          baseUrl,
          eventsConfig,
          disqualificationConfig,
          config,
          snapshotConfig,
          screenshotConfig,
          compatibilityCheckConfig,
          callbacks: {
            ...callbacks,
            onDisqualified: () => {
              setStatus('Disqualified');
              callbacks?.onDisqualified?.();
            }
          },
          enableAllAlerts,
          headerOptions,
          mockModeEnabled
        });
        
        await proctor.initializeProctoring();
        setStatus('Proctoring Active');
      } catch (error) {
        setStatus('Failed to initialize proctoring');
        console.error('Proctoring initialization failed:', error);
      }
    };

    initializeProctoring();
  }, []);

  return (
    <div className="widget-container">
      <h2>Proctoring Status: {status}</h2>
    </div>
  );
};

export default App;