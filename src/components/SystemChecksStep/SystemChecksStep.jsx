import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { nextStep } from '@/store/features/workflowSlice';
import StepHeader from '@/ui/stepHeader';
import CompatibilityStep from './CompatibilityStep';

import styles from './SystemChecksStep.module.scss';


const COMPATIBILITY_CHECK_DATA = {
  systemCompatibility: {
    default: {
      title: 'System Compatibility',
      description: `We'll check your browser settings to ensure the test runs smoothly`,
    },
    success: {
      title: 'System Compatibility',
    },
    failed: {
      title: 'System Compatibility',
      description: `We'll check your browser settings to ensure the test runs smoothly`,
      error: (<i><b>Error</b> - Supported browsers: Latest three versions of Chrome (preferred), Microsoft edge, Firefox and Safari browser</i>)
    }, 
  },
  networkCompatibility: {
    default: {
      title: 'Network Checks : Compatibility',
      description: `Checking your network connection to ensure it stays stable during the test.`,
    },
    success: {
      title: 'Network Checks : Compatibility',
    },
    failed: {
      title: 'Network Checks : Compatibility',
      description: `Checking your network connection to ensure it stays stable during the test.`,
      error: (<i><b>Error</b> - Network speed: <b>Atleast 512kbps</b></i>)
    },
  },
  fullScreenCompatibilty: {
    default: {
      title: 'Full Screen Check',
      description: `Ensure you stay in full-screen mode at all times`,
    },
    success: {
      title: 'Full Screen Check',
    },
    failed: {
      title: 'Full Screen Check',
      description: `Ensure you stay in full-screen mode at all times`,
      extraUi: (<> 
        <i className="mr-2 whitespace-nowrap">Press <b>ENTER KEY</b> or</i>
        <button type="button" className="outline outline-1 outline-blue-500 text-blue-500 rounded py-3 px-6">
          Enter Full Screen Mode
        </button>
      </>),
      error: (<i><b>Error</b> - Switch to full screen mode</i>)
    },
  }
}

const DEFAULT_STATUS_MAP = {
  systemCompatibility: 'success',
  fullScreenCompatibilty: 'failed',
  networkCompatibility: 'default'
};

const SystemChecksStep = ({ statusMap = DEFAULT_STATUS_MAP }) => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
 
  return (
    <div className='p-8 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='4'
        title='System Compatibility Checks'
        description='Complete all system checks to ensure your assessment runs smoothly without interruptions'
      />
      <section className={styles.container}>
      {Object.keys(statusMap).map((check) => {
        const checkStatus = statusMap[check];
        const checkData = COMPATIBILITY_CHECK_DATA?.[check]?.[checkStatus];
        if (checkData){
          return (
            <CompatibilityStep {...checkData} status={checkStatus} />
          ) 
        }
      })}
      </section>
      <div className='mt-8'>
        <div className='flex items-start gap-2 mt-6 text-xs'>
          <Checkbox
            id='confirm'
            className="mt-2 mr-2"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked)}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking, you confirm that all your compatibility checks remains
            same. Failure to maintain proper setup may result in interruption.
          </label>
        </div>
        <Button
          className='mt-8 items-center'
          variant='primary'
          disabled={!isChecked}
          onClick={() => dispatch(nextStep())}
        >
          Proceed to next step
          <ArrowRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  );
};

export default SystemChecksStep;
