import React, { useState, useEffect, useMemo } from 'react';
import { WorkflowStepKey } from '@/types/workflowTypes';
import { ClockIcon } from 'lucide-react';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { useAppSelector } from '@/hooks/reduxhooks';

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
  const { message, time } = useMemo(
    () => STEP_VS_MESSAGE_MAPPING[activeStep],
    [activeStep]
  );
  const proctor = useAppSelector(selectProctor);

  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    setTimeLeft(time);
  }, [modalOpen, time]);

  useEffect(() => {
    if (timeLeft <= 0) {
      proctor?.disqualifyUser();
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
      <div className='py-2 relative flex flex-row items-center uppercase font-bold text-center text-black text-sm z-40 tracking-widest'>
        {message}
        <span className='ml-4 inline-flex items-center gap-1 text-base font-bold'>
          <ClockIcon className='h-6 w-6 font-bold' />
          {formatTime(timeLeft)}
        </span>
      </div>
      <div className='absolute top-0 left-0 h-full w-full bg-[#FFEBEF] rounded-t-2xl overflow-hidden'>
        <div
          className='h-full bg-red-700 transition-all duration-1000 ease-linear animate-pulse'
          style={{ width: `${100 - (timeLeft / time) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default DisqualificationTimerBar;
