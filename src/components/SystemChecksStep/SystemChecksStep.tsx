import React, { useState } from 'react';
import StepHeader from '@/ui/stepHeader';
import CompatibilityCard from '@/ui/compatibilityCard';
import { Checkbox } from '@/ui/checkbox';
import { Button } from '@/ui/button';
import { ArrowRight } from 'lucide-react';

const SystemChecksStep = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className='p-8 flex-1'>
      <StepHeader
        stepNumber='4'
        title='System Compatibility Checks'
        description='Complete all system checks to ensure your assessment runs smoothly without interruptions'
      />
      <div className='mt-8'>
        <div className='flex items-center gap-2 mt-6 text-sm'>
          <Checkbox
            id='confirm'
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label htmlFor='confirm' className='text-sm text-gray-600'>
            By clicking, you confirm that all your compatibility checks remains
            same. Failure to maintain proper setup may result in interruption.
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

export default SystemChecksStep;
