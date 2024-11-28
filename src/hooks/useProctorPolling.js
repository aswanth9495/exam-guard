import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useGetPollingDataQuery } from '@/services/mobilePairingService'; // Adjust path as needed
import { selectProctor } from '@/store/features/assessmentInfoSlice';

const useProctorPolling = ({
  onSetupSuccess,
  onSetupFailure,
  onBatteryLow,
  onBatteryNormal,
  onSnapshotSuccess,
  onSnapshotFailure,
  onDataUpdate,
}, pollingInterval = 5000) => {
  const proctor = useSelector((state) => selectProctor(state));
  const pollingPayload = proctor?.mobilePairingConfig?.defaultPayload || {};
  const pollingEndpoint = proctor?.mobilePairingConfig?.endpoint || {};
  // `pollingInterval` specifies how often to fetch data
  const { data, isFetching, refetch } = useGetPollingDataQuery({
    endpoint: pollingEndpoint,
    payload: pollingPayload,
  }, {
    pollingInterval,
  });

  useEffect(() => {
    if (data) {
      onDataUpdate?.(data);
      const secondaryCameraChecks = data.checks?.secondary_camera.checks;
      Object.keys(secondaryCameraChecks).map((check) => {
        const checkData = secondaryCameraChecks[check];
        switch (check) {
          case 'setup':
            if (checkData?.success) {
              onSetupSuccess?.(checkData);
            } else {
              onSetupFailure?.(checkData);
            }
            break;
          case 'snapshot':
            if (checkData?.success) {
              onSnapshotSuccess?.(checkData);
            } else {
              onSnapshotFailure?.(checkData);
            }
            break;
          case 'battery':
            if (checkData?.success) {
              onBatteryNormal?.(checkData, data);
            } else {
              onBatteryLow?.(checkData, data);
            }
            break;
          default:
            break;
        }
        return null;
      });
    }
  }, [data, onBatteryLow, onBatteryNormal,
    onDataUpdate, onSetupFailure, onSetupSuccess,
    onSnapshotFailure, onSnapshotSuccess]);

  return { data, isFetching, refetch };
};

export default useProctorPolling;
