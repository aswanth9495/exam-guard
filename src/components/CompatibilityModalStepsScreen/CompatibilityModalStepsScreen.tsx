import React from 'react';

import { STEPS } from '@/constants/workflow';
import { setActiveStep } from '@/store/features/workflowSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';

interface StepItemProps {
  icon: React.ElementType;
  title: string;
  step: string;
  active: boolean;
  onClick: () => void;
  isLast: boolean;
}

const StepItem: React.FC<StepItemProps> = ({
  icon: Icon,
  title,
  step,
  active,
  onClick,
  isLast,
}) => (
  <div
    className='relative flex items-start gap-4 cursor-pointer'
    onClick={onClick}
  >
    <div className='flex flex-col items-center'>
      <div
        className={`rounded-full p-3 ${active ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-400'}`}
      >
        <Icon className='w-5 h-5' />
      </div>
      {!isLast && <div className='w-px h-12 bg-blue-100'></div>}
    </div>
    <div>
      <div className='text-xs text-gray-400'>STEP {step}</div>
      <div
        className={`${active ? 'font-bold text-blue-500' : 'font-medium text-gray-700'}`}
      >
        {title}
      </div>
    </div>
  </div>
);

const CompatibilityModalStepsScreen: React.FC = () => {
  const activeStep = useAppSelector((state) => state.workflow.activeStep);
  const dispatch = useAppDispatch();

  return (
    <div className='mt-12'>
      {Object.entries(STEPS).map(([key, item], index) => (
        <StepItem
          key={key}
          icon={item.icon}
          title={item.title}
          step={key}
          active={activeStep === key}
          onClick={() => dispatch(setActiveStep(key))}
          isLast={index === Object.keys(STEPS).length - 1}
        />
      ))}
    </div>
  );
};

export default CompatibilityModalStepsScreen;
