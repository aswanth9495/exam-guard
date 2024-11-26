import React, { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/reduxhooks';
import { setAssessmentInfo } from '@/store/features/assessmentInfoSlice';
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
  assessmentInfo,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeProctoring = async () => {
      try {
        const Proctor = (await import('./proctor')).default;
        // eslint-disable-next-line no-unused-vars
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
              callbacks?.onDisqualified?.();
            },
          },
          enableAllAlerts,
          headerOptions,
          mockModeEnabled,
        });

        // await proctor.initializeProctoring();
        dispatch(setAssessmentInfo(assessmentInfo));
      } catch (error) {
        console.error('Proctoring initialization failed:', error);
      }
    };

    initializeProctoring();
  }, [dispatch]);

  return <CompatibilityModal />;
};

export default App;
