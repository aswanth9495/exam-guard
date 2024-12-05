import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import { useDispatch } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import ReferenceImage from '@/ui/ReferenceImage';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import useProctorPolling from '@/hooks/useProctorPolling';
import { MIN_SNAPSHOT_COUNT } from '@/utils/constants';

import Loader from '@/ui/Loader';
import ProgressBar from '@/ui/ProgressBar';
import { nextSubStep } from '@/store/features/workflowSlice';

import styles from './MobileCameraStep.module.scss';

function Orientation({ className }) {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [snapshotCollected, setSnapshotCollected] = useState(false);
  const [snapShotCount, setSnapshotCount] = useState(0);
  const [snapshotToShow, setSnapshotToShow] = useState(null);
  const [previousSnapshot, setPreviousSnapshot] = useState(null);
  const [retrySnapshot, setRetrySnapshot] = useState(false);

  const collectSnapshots = useCallback((snapShotData) => {
    const snapshotLength = snapShotData?.metadata?.length;
    if (snapshotLength > 0) {
      setSnapshotCount(snapshotLength);
      const firstSnapshot = snapShotData?.metadata?.[0].value;
      const lastSnapshot = snapShotData?.metadata?.[snapShotData.metadata.length - 1]?.value;

      if (!snapshotToShow) {
        setSnapshotToShow(firstSnapshot);
      }
      if (!retrySnapshot) {
        setPreviousSnapshot(lastSnapshot);
      } else if (previousSnapshot !== lastSnapshot) {
        setSnapshotToShow(lastSnapshot);
        setPreviousSnapshot(lastSnapshot);
        setRetrySnapshot(false);
      }
    }
  }, [previousSnapshot, retrySnapshot, snapshotToShow]);

  const handleSnapshotSuccess = useCallback((snapShotData) => {
    collectSnapshots(snapShotData);
    setSnapshotCount(MIN_SNAPSHOT_COUNT);
    setSnapshotCollected(true);
  }, [collectSnapshots]);

  const handleSnapshotFailure = useCallback((snapShotData) => {
    collectSnapshots(snapShotData);
  }, [collectSnapshots]);

  const handleRetry = useCallback(() => {
    setRetrySnapshot(true);
  }, []);

  const handleProceed = useCallback(() => {
    dispatch(nextSubStep());
  }, [dispatch]);

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
              {snapshotToShow && !retrySnapshot
                ? <img className={styles.snapshotImage}
                  src={snapshotToShow} alt="snapshot"/>
                : (
                  <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 translate-y-[-50%]">
                    <Loader size='md'/>
                    {retrySnapshot ? <div className='text-xs text-center mt-2'>Taking snapshot. Keep your phone steady</div>
                      : <div className='text-xs text-center mt-2'>Collecting Snapshot...</div>}
                  </div>
                )
              }
            </div>
          </div>
          {!snapshotCollected
          && <div className="flex flex-col text-center mt-4">
              <ProgressBar progress={(snapShotCount / MIN_SNAPSHOT_COUNT) * 100}/>
              <span className="text-2xs">
                 Collecting snapshot
                 {' '}
                {parseInt((snapShotCount / MIN_SNAPSHOT_COUNT) * 100, 10)}%
              </span>
            </div>}
          {snapshotToShow && snapshotCollected && (
            <div className="flex-column items-center text-center">
              <button
                type="button"
                className={styles.retrySnapshot}
                onClick={handleRetry}
              >
                Check Photo Alignment
              </button>
              <p className='text-gray-500 italic text-2xs'>
                Note: Click &apos;Proceed&apos; once you confirm the photo is aligned
              </p>
          </div>
          )}

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
            className='mt-1 mr-2 h-5 w-5'
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
          className="mt-8 items-center"
          variant="primary"
          disabled={!isChecked || !snapshotCollected}
          onClick={handleProceed}
        >
          Proceed to next step
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

export default Orientation;
