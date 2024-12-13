import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash'; // Use lodash for deep comparison
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

  const { data } = useGetPollingDataQuery({
    endpoint: pollingEndpoint,
    payload: pollingPayload,
  }, { pollingInterval });

  const previousDataRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Compare new data with the previous data
    if (isEqual(previousDataRef.current, data)) {
      // No changes in data; skip processing
      return;
    }

    // Store the current data for future comparison
    previousDataRef.current = data;

    // Call the onDataUpdate callback
    onDataUpdate?.(data);

    // Process secondary camera checks
    const secondaryCameraChecks = data.checks?.secondary_camera.checks || {};
    Object.keys(secondaryCameraChecks).forEach((check) => {
      const checkData = secondaryCameraChecks[check];
      switch (check) {
        case 'setup':
          // eslint-disable-next-line no-unused-expressions
          checkData?.success
            ? onSetupSuccess?.(checkData)
            : onSetupFailure?.(checkData);
          break;
        case 'snapshot':
          // eslint-disable-next-line no-unused-expressions
          checkData?.success
            ? onSnapshotSuccess?.(checkData)
            : onSnapshotFailure?.(checkData);
          break;
        case 'battery':
          // eslint-disable-next-line no-unused-expressions
          checkData?.success
            ? onBatteryNormal?.(checkData, data)
            : onBatteryLow?.(checkData, data);
          break;
        default:
          break;
      }
    });
  }, [data, onBatteryLow, onBatteryNormal, onDataUpdate,
    onSetupFailure, onSetupSuccess, onSnapshotFailure, onSnapshotSuccess]);
};

export default useProctorPolling;
