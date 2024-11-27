import { useEffect } from 'react';
import { useGetPollingDataQuery } from '@/services/mobilePairingService'; // Adjust path as needed

const useProctorPolling = ({
  onSetupSuccess,
  onSetupFailure,
  onBatteryLow,
  onBatteryNormal,
  onSnapshotSuccess,
  onSnapshotFailure,
  onDataUpdate,
}, pollingInterval = 5000) => {
  // `pollingInterval` specifies how often to fetch data
  const { data, isFetching, refetch } = useGetPollingDataQuery({ testId: 16884 }, {
    pollingInterval,
  });

  useEffect(() => {
    if (data) {
      onDataUpdate?.();
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
