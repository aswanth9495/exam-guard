import React, { useCallback, useState } from 'react';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { nextStep } from '@/store/features/workflowSlice';
import StepHeader from '@/ui/stepHeader';
import { Tabs, Tab } from '@/ui/Tabs';
import { useDispatch } from 'react-redux';
import Pairing from './Pairing';
import Orientation from './Orientation';
import MobileCompatibility from './MobileCompatibility';
import { PAIRING_STEPS } from '@/utils/constants';

const MobileCameraStep = () => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch()
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState(PAIRING_STEPS.pairing);

  const handleTabClick = useCallback((tabName) => {
    setActiveTab(tabName)
  }, []);

  console.log('%c⧭', 'color: #364cd9', activeTab, PAIRING_STEPS.mobileCompatibility === activeTab);

  return (
    <div className='p-8 flex-1 overflow-y-auto'>
      <StepHeader
        stepNumber='3'
        title='Mobile Camera Pairing Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
      />
      <Tabs activeTab={activeTab} onTabChange={handleTabClick} className="mt-20">
        <Tab label="Scan Code & Pair Mobile" 
          name={PAIRING_STEPS.pairing}
        >
          <Pairing />
        </Tab>
        <Tab label="Camera Orientation" 
          name={PAIRING_STEPS.orientation}
        >
          <Orientation setActiveTab={setActiveTab} />
        </Tab>
        <Tab label="Mobile System Check" 
          name={PAIRING_STEPS.mobileCompatibility}
        >
          <MobileCompatibility setShowDisclaimer={setShowDisclaimer} />
        </Tab>
      </Tabs>
      {showDisclaimer && (<div className='mt-8'>
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
          onClick={() => dispatch(nextStep())}
        >
          Proceed to next step
          <ArrowRight className='w-6 h-6' />
        </Button>
      </div>)}
    </div>
  );
};

export default MobileCameraStep;

