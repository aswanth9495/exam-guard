import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { ArrowRight, CameraOffIcon } from 'lucide-react';
import ReferenceImage from '@/ui/ReferenceImage';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import useProctorPolling from '@/hooks/useProctorPolling';
import { MIN_SNAPSHOT_COUNT } from '@/utils/constants';

import Loader from '@/ui/Loader';
import ProgressBar from '@/ui/ProgressBar';
import { nextSubStep } from '@/store/features/workflowSlice';

import styles from './MobileCameraStep.module.scss';

function Orientation({ className, setSwitchModalOpen }) {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [snapshotCollected, setSnapshotCollected] = useState(false);
  const [snapShotCount, setSnapshotCount] = useState(0);
  const [previousSnapshot, setPreviousSnapshot] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const collectSnapshots = useCallback((snapShotData) => {
    const snapshotLength = snapShotData?.metadata?.length || 0;
    setSnapshotCount(snapshotLength);

    if (snapshotLength > 0) {
      const lastSnapshot = snapShotData?.metadata?.[snapShotData.metadata.length - 1]?.value;

      if (previousSnapshot !== lastSnapshot) setPreviousSnapshot(lastSnapshot);
    }
  }, [previousSnapshot]);

  const handleSnapshotSuccess = useCallback((snapShotData) => {
    collectSnapshots(snapShotData);
    setSnapshotCount(MIN_SNAPSHOT_COUNT);
    setSnapshotCollected(true);
  }, [collectSnapshots]);

  const handleSnapshotFailure = useCallback((snapShotData) => {
    collectSnapshots(snapShotData);
  }, [collectSnapshots]);

  const handleProceed = useCallback(() => {
    dispatch(nextSubStep());
  }, [dispatch]);

  // Reset countdown when snapshots are fetched
  useEffect(() => {
    setCountdown(5); // Reset countdown to 5 seconds
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [previousSnapshot]); // Dependency on snapshot updates

  useProctorPolling({
    onSnapshotSuccess: handleSnapshotSuccess,
    onSnapshotFailure: handleSnapshotFailure,
  });

  return (
    <div className="flex flex-col">
      <div className={classNames(
        styles.orientationContainer,
        { [className]: className },
      )}>
        <section className={styles.snapshotPreviewContainer}>
          {/* Snapshot section */}
          <div className={styles.snapshotPreview}>
            <div className={styles.snapshotImageContainer}>
              {previousSnapshot
                ? <img className={styles.snapshotImage}
                  src={previousSnapshot} alt="snapshot"/>
                : (<div className="absolute top-1/2 right-1/2 transform translate-x-1/2 translate-y-[-50%]">
                    <Loader size='md'/>
                    <div className='text-xs text-center mt-2'>Collecting Snapshot...</div>
                  </div>)
              }
              {/* {
                snapShotCount === 0 && (
                  <div className="absolute top-1/2 right-1/2 transform translate-x-1/2
                  translate-y-[-50%]">
                      <CameraOffIcon className="text-red-500"/>
                  </div>
                )
              } */}
            </div>
          </div>
         <div className="flex flex-col text-center mt-4">
              <ProgressBar progress={(snapShotCount / MIN_SNAPSHOT_COUNT) * 100}/>
              <span className="text-xs mt-2 text-gray-500">
                {snapShotCount === MIN_SNAPSHOT_COUNT ? (<> Snapshots Collected !</>)
                  : (<>Collecting snapshot
                 {' '}
                {parseInt((snapShotCount / MIN_SNAPSHOT_COUNT) * 100, 10)}%</>) }
              </span>
              {<div className="text-xs text-gray-500 mt-2">
                Auto fetching image in {countdown} seconds...
              </div>}
          </div>
        {/* {
          snapShotCount === 0 && <div className='text-xs text-center mt-2'>
          Please Scan the <b>QR Code again</b> or Make sure your phone
          is capturing snapshots
        </div>
        } */}
        </section>
        <section className={styles.orientationInstructionsContainer}>
          <article className={styles.orientationInstructions}>
            <heading className={styles.orientationInstructionHeading}>
              Instructions :
            </heading>
            <ul className={styles.orientationInstructionPoints}>
              <li>Place your mobile device on a stable surface</li>
              <li>
                You can choose a landscape or portrait orientation,
                but make sure that your desktop, your hands and the workspace
                are clearly visible
              </li>
              <li>
                Please ensure adequate lighting in the surroundings
              </li>
            </ul>
          </article>
          <section className={styles.referenceImageList}>
            <ReferenceImage
              className={styles.referenceImage}
              imageSrc="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/097/334/original/Iterations_Video.png?1732454276"
              failed={false}
              description="Straight face"
            />
            <ReferenceImage
              className={styles.referenceImage}
              imageSrc="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/097/334/original/Iterations_Video.png?1732454276"
              failed={true}
              description="Blurred Image"
            />
            <ReferenceImage
              className={styles.referenceImage}
              imageSrc="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/097/334/original/Iterations_Video.png?1732454276"
              failed={true}
              description="Workspace not captured"
            />
          </section>
        </section>
      </div>
      <div className="mt-16">
        <div className="flex items-start gap-2 mt-6 text-sm">
          <Checkbox
            id="confirm"
            className='mr-2 h-5 w-5'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked)}
          />
          <label htmlFor="confirm" className="text-xs text-gray-600">
            By clicking on this, you confirm that your mobile phone is paired
            and will remain charged during the test. If disconnected, you'll
            need to reconnect before being able to continue with the test.
          </label>
        </div>
        <Button
          className="mt-8 items-center py-8 px-10"
          variant="primary"
          disabled={!isChecked || !snapshotCollected}
          onClick={handleProceed}
        >
          Proceed to next step
          <ArrowRight className="w-6 h-6" />
        </Button>
        <Button
          className='mt-8 items-center py-8 px-10 ml-6'
          variant='outline'
          onClick={() => setSwitchModalOpen(true)}
        >
          Scan QR Code again
        </Button>
      </div>
    </div>
  );
}

export default Orientation;
