import React, { useState } from 'react';
import classNames from 'classnames';

import ReferenceImage from '@/ui/ReferenceImage';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { CameraOff, ArrowRight } from 'lucide-react';

import styles from './MobileCameraStep.module.scss';
import { PAIRING_STEPS } from '@/utils/constants';

function Orientation({ className, setActiveTab }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col">
      <div className={classNames(styles.orientationContainer, { [className]: className })}>
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
      <div className='mt-16'>
        <div className='flex items-start gap-2 mt-6 text-sm'>
          <Checkbox
            className="mt-2 mr-2"
            id='confirm'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked)}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that your mobile phone is paired
            and will remain charged during the test. If disconnected, you'll
            need to reconnect before being able to continue with the test.
          </label>
        </div>
        <Button
          className='mt-8 items-center'
          variant='primary'
          disabled={!isChecked}
          onClick={() => {
            console.log('%c⧭', 'color: #994d75', 'hello');
            setActiveTab(PAIRING_STEPS.mobileCompatibility)
          }}
        >
          Proceed to next step
          <ArrowRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  );
}

export default Orientation;