import React, { useState } from 'react';
import StepHeader from '@/ui/stepHeader';
import { Checkbox } from '@/ui/checkbox';
import { Button } from '@/ui/button';
import { ArrowRight } from 'lucide-react';

const MobileCameraStep = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className='p-8 flex-1'>
      <StepHeader
        stepNumber='3'
        title='Mobile Camera Pairing Permissions'
        description='Test if screen share permissions are enabled. If not, follow the instructions below to enable them'
      />
      <div className='mt-8'>
        <p className='text-gray-600 mt-8 text-xs italic text-sm'>
          <strong>Please Note :</strong> You will need to set up screen sharing
          again when your test begins, as the environment will refresh.
        </p>
        <div className='flex items-center gap-2 mt-6 text-sm'>
          <Checkbox
            id='confirm'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor='confirm' className='text-xs text-gray-600'>
            By clicking on this, you confirm that your mobile phone is paired
            and will remain charged during the test. If disconnected, you'll
            need to reconnect before being able to continue with the test.
          </label>
        </div>
        <Button className='mt-8' variant='primary' disabled={!isChecked}>
          Proceed to next step
          <ArrowRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
};

export default MobileCameraStep;
