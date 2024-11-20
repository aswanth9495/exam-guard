import React, { useEffect, useState } from 'react';

import { useDispatch } from '@/hooks/reduxhooks';
import { setUser } from '@/store';
import CompatibilityModal from '@/components/CompatibilityModal';

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
  mockModeEnabled,
  additionalData
}) => {
  const [status, setStatus] = useState('Initializing...');
  const dispatch = useDispatch();

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

        const userInfo = additionalData.userInfo;
        dispatch(setUser(userInfo));

      } catch (error) {
        setStatus('Failed to initialize proctoring');
        console.error('Proctoring initialization failed:', error);
      }
    };

    initializeProctoring();
  }, [dispatch]);

  return (
    <CompatibilityModal />
  );
};

export default App;