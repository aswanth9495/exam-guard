import React from 'react';
import { CheckCircle, AlertTriangle, CheckIcon } from 'lucide-react';

import { STEPS } from '@/constants/workflow';
import { setActiveStep } from '@/store/features/workflowSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';
import { WorkflowStepKey, Status } from '@/types/workflowTypes';

interface StepItemProps {
  icon: React.ElementType;
  title: string;
  step: number;
  active: boolean;
  onClick: () => void;
  isLast: boolean;
  status?: Status;
}

const StepItem: React.FC<StepItemProps> = ({
  icon: Icon,
  title,
  step,
  active,
  onClick,
  isLast,
  status,
}) => (
  <div
    className='relative flex items-start gap-4 cursor-pointer'
    onClick={onClick}
  >
    <div className='flex flex-col items-center'>
      <div
        className={`rounded-full p-5 ${
          status === 'completed'
            ? 'bg-green-500 text-white'
            : status === 'error'
              ? 'bg-red-500 text-white'
              : active
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-400'
        }`}
      >
        {status === 'completed' ? (
          <CheckCircle className='w-8 h-8' />
        ) : status === 'error' ? (
          <AlertTriangle className='w-8 h-8' />
        ) : (
          <Icon className='w-8 h-8' />
        )}
      </div>
      {!isLast && <div className='w-px h-20 bg-blue-100'></div>}
    </div>
    <div>
      <div className='text-xs text-gray-400'>STEP {step}</div>
      <div
        className={`text-base ${
          status === 'error'
            ? 'font-bold text-red-500'
            : active
              ? 'font-bold text-blue-500'
              : 'font-medium text-gray-700'
        }`}
      >
        {title}
      </div>
    </div>
  </div>
);

const CompatibilityModalStepsScreen: React.FC = () => {
  const activeStep = useAppSelector((state) => state.workflow.activeStep);
  const steps = useAppSelector((state) => state.workflow.steps);
  const dispatch = useAppDispatch();

  return (
    <div className='mt-16'>
      {Object.entries(STEPS).map(([key, item], index) => {
        const stepData = steps[key as WorkflowStepKey];
        const isClickable = !stepData.locked;

        return (
          <StepItem
            key={key}
            icon={item.icon}
            title={item.title}
            step={index + 1}
            active={activeStep === key}
            onClick={() =>
              isClickable && dispatch(setActiveStep(key as WorkflowStepKey))
            }
            isLast={index === Object.keys(STEPS).length - 1}
            status={stepData.status}
          />
        );
      })}
    </div>
  );
};

export default CompatibilityModalStepsScreen;
