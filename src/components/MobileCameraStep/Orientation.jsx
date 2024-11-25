import React from 'react';
import classNames from 'classnames';

import ReferenceImage from '@/ui/ReferenceImage';

import { CameraOff } from 'lucide-react';

import styles from './MobileCameraStep.module.scss';

function Orientation({ className }) {
  return (
    <div className={classNames(styles.orientationContainer, { [className]: className })}>
      {/* <ReferenceImage 
        imageSrc="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/097/334/original/Iterations_Video.png?1732454276" 
        failed={true}
      ></ReferenceImage> */}

      <section className={styles.snapshotPreviewContainer}>
        {/* Snapshot section */}
        <div className={styles.snapshotPreview}>
          <div className={styles.noSnapshot}>
            <CameraOff />
          </div>
        </div>
        <button 
          type="button" 
          className={styles.retrySnapshot}
        >
          Retry Mobile Snapshot
        </button>
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
  );
}

export default Orientation;