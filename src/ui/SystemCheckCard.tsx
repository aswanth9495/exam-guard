import React from 'react';
import { AlertTriangle, CircleCheck, Loader2 } from 'lucide-react';

import { Button } from '@/ui/Button';
import { cn } from '@/lib/utils';
import { selectStep } from '@/store/features/workflowSlice';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { Status } from '@/types/workflowTypes';
import { useAppSelector } from '@/hooks/reduxhooks';

type CheckId = 'systemChecks' | 'networkChecks' | 'fullScreenCheck';

interface CheckData {
  title: string;
  description?: string;
  icon: React.ReactNode;
  error?: React.ReactNode;
  extraUi?: React.ReactNode;
}

interface CompatibilityStepProps extends CheckData {
  checkId: CheckId;
  status: Status;
}

const CompatibilityStep: React.FC<CompatibilityStepProps> = ({
  status,
  title,
  description,
  icon,
  error,
  extraUi,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full p-8 px-12 bg-white',
        status === 'error' && 'bg-red-50',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-8',
          status === 'error' && 'items-start',
        )}
      >
        <div className='mt-1'>{icon}</div>
        <div className='flex flex-col gap-1.5'>
          <h3 className='font-medium text-gray-900 text-base'>{title}</h3>
          {status === 'error' && description && (
            <p className='text-gray-500 text-sm italic'>{description}</p>
          )}
          {error && (
            <div className='mt-1 text-xs italic text-red-500'>{error}</div>
          )}
        </div>
      </div>
      {extraUi && <div className='flex items-center'>{extraUi}</div>}
    </div>
  );
};

export default function SystemCheckCard() {
  const compatibilityStep = useAppSelector((state) =>
    selectStep(state, 'compatibilityChecks'),
  );
  const proctor = useAppSelector(selectProctor);

  const COMPATIBILITY_CHECK_DATA = {
    systemChecks: {
      locked: {
        title: 'System Compatibility',
        description:
          "We'll check your browser settings to ensure the test runs smoothly",
        icon: <Loader2 className='w-12 h-12 text-scaler-500 animate-spin' />,
      },
      pending: {
        title: 'System Compatibility',
        description:
          "We'll check your browser settings to ensure the test runs smoothly",
        icon: <Loader2 className='w-12 h-12 text-scaler-500 animate-spin' />,
      },
      completed: {
        title: 'System Compatibility',
        description:
          "We'll check your browser settings to ensure the test runs smoothly",
        icon: <CircleCheck className='w-12 h-12 text-white fill-green-600' />,
      },
      error: {
        title: 'System Compatibility',
        description:
          "We'll check your browser settings to ensure the test runs smoothly",
        icon: <AlertTriangle className='w-12 h-12 text-red-500' />,
        error: (
          <span className='text-red-500'>
            <strong>Error</strong> - Supported browsers: Latest three versions
            of Chrome (preferred), Microsoft edge, Firefox and Safari browser
          </span>
        ),
        extraUi: null,
      },
    },
    networkChecks: {
      locked: {
        title: 'Network Checks : Compatibility',
        description:
          'Checking your network connection to ensure it stays stable during the test.',
        icon: <Loader2 className='w-12 h-12 text-scaler-500 animate-spin' />,
      },
      pending: {
        title: 'Network Checks : Compatibility',
        description:
          'Checking your network connection to ensure it stays stable during the test.',
        icon: <Loader2 className='w-12 h-12 text-scaler-500 animate-spin' />,
      },
      completed: {
        title: 'Network Checks : Compatibility',
        description:
          'Checking your network connection to ensure it stays stable during the test.',
        icon: <CircleCheck className='w-12 h-12 text-white fill-green-600' />,
      },
      error: {
        title: 'Network Checks : Compatibility',
        description:
          'Checking your network connection to ensure it stays stable during the test.',
        icon: <AlertTriangle className='w-12 h-12 text-red-500' />,
        error: (
          <span className='text-red-500'>
            Error - Network speed:{' '}
            <span className='font-medium'>Atleast 512kbps</span>
          </span>
        ),
        extraUi: null,
      },
    },
    fullScreenCheck: {
      locked: {
        title: 'Switch to full screen mode',
        description: 'Ensure you stay in full-screen mode at all times',
        icon: <Loader2 className='w-12 h-12 text-scaler-500 animate-spin' />,
      },
      pending: {
        title: 'Switch to full screen mode',
        description: 'Ensure you stay in full-screen mode at all times',
        icon: <Loader2 className='w-12 h-12 text-scaler-500 animate-spin' />,
      },
      completed: {
        title: 'Switch to full screen mode',
        description: 'Ensure you stay in full-screen mode at all times',
        icon: <CircleCheck className='w-12 h-12 text-white fill-green-600' />,
      },
      error: {
        title: 'Switch to full screen mode',
        description: 'Ensure you stay in full-screen mode at all times',
        icon: <AlertTriangle className='w-12 h-12 text-red-500' />,
        error: (
          <span className='text-red-500'>
            Error - Switch to full screen mode
          </span>
        ),
        extraUi: (
          <div className='flex flex-row flex-wrap items-center gap-2 justify-end'>
            <span className='text-base-200 italic text-sm mr-2G'>
              Press <span className='font-semibold'>ENTER KEY</span> or
            </span>
            <Button
              variant='outline'
              className='text-scaler-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 text-sm'
              onClick={() => proctor?.enableFullScreen()}
            >
              Enter Full Screen Mode
            </Button>
          </div>
        ),
      },
    },
  };

  return (
    <div className='max-w-full'>
      <section className='flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-200'>
        {Object.entries(COMPATIBILITY_CHECK_DATA).map(
          ([checkId, checkData]) => {
            const subStepStatus = compatibilityStep.subSteps[checkId].status;
            return (
              <CompatibilityStep
                key={checkId}
                checkId={checkId as CheckId}
                status={subStepStatus}
                {...checkData[subStepStatus]}
              />
            );
          },
        )}
      </section>
    </div>
  );
}
