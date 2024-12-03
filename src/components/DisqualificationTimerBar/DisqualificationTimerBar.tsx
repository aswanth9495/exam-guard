import React, { useState, useEffect } from 'react';
import { WorkflowStepKey } from '@/types/workflowTypes';
import { ClockIcon } from 'lucide-react';

interface DisqualificationTimerBarProps {
  activeStep: WorkflowStepKey;
  modalOpen: boolean;
}

const STEP_VS_MESSAGE_MAPPING = {
  screenShare: {
    message: 'Disqualified in',
    time: 45,
  },
  cameraShare: {
    message: 'Disqualified in',
    time: 45,
  },
  mobileCameraShare: {
    message: 'Disqualified in',
    time: 90,
  },
  compatibilityChecks: {
    message: 'Disqualified in',
    time: 45,
  },
};

const DisqualificationTimerBar: React.FC<DisqualificationTimerBarProps> = ({
  activeStep,
  modalOpen,
}) => {
  const { message, time } = STEP_VS_MESSAGE_MAPPING[activeStep];
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    setTimeLeft(time);
  }, [modalOpen, time]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // TODO: Add a handler for disqualification
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='relative rounded-t-lg w-full text-white flex flex-row items-center justify-center'>
      <div className='py-2 relative flex flex-row items-center uppercase font-bold text-center text-black text-sm z-40'>
        {message}
        <span className='ml-4 inline-flex items-center gap-1 text-base font-bold'>
          <ClockIcon className='h-6 w-6 font-bold' />
          {formatTime(timeLeft)}
        </span>
      </div>
      <div className='absolute top-0 left-0 h-full w-full bg-[#FFEBEF] rounded-t-2xl overflow-hidden'>
        <div
          className='h-full bg-[#E22D4C] transition-all duration-1000 ease-linear'
          style={{ width: `${100 - (timeLeft / time) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default DisqualificationTimerBar;
