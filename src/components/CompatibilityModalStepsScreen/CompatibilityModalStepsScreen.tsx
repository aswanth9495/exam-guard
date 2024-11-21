import React, { useState } from 'react';
import { Step } from '@/global/types';

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

const CompatibilityModalStepsScreen: React.FC<{
  steps: Record<string, Step>;
  activeStep: number;
  setActiveStep: (step: number) => void;
}> = ({ steps, activeStep, setActiveStep }) => {
  return (
    <div className='mt-12'>
      {Object.entries(steps).map(([key, item], index) => (
        <StepItem
          key={key}
          icon={item.icon}
          title={item.title}
          step={key}
          active={activeStep === Number(key)}
          onClick={() => setActiveStep(Number(key))}
          isLast={index === Object.keys(steps).length - 1}
        />
      ))}
    </div>
  );
};

export default CompatibilityModalStepsScreen;
