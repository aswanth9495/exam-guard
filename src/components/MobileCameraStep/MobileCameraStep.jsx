import React, { useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { nextStep } from '@/store/features/workflowSlice';
import StepHeader from '@/ui/StepHeader';
import { Tabs, Tab } from '@/ui/Tabs';
import { useDispatch } from 'react-redux';
import Pairing from './Pairing';
import Orientation from './Orientation';
import MobileCompatibility from './MobileCompatibility';

const MobileCameraStep = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch()

  return (
    <div className='p-8 flex-1'>
      <StepHeader
        stepNumber='3'
        title='Mobile Camera Pairing Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
      />
      <Tabs>
        <Tab label="Scan Code & Pair Mobile" isActive={true}>
          <Pairing />
        </Tab>
        <Tab label="Camera Orientation" >
          <Orientation />
        </Tab>
        <Tab label="Mobile System Check">
          <MobileCompatibility />
        </Tab>
      </Tabs>
      <div className='mt-8'>

        <div className='flex items-center gap-2 mt-6 text-sm'>
          <Checkbox
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
          className='mt-8'
          variant='primary'
          disabled={!isChecked}
          onClick={() => dispatch(nextStep())}
        >
          Proceed to next step
          <ArrowRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
};

export default MobileCameraStep;

