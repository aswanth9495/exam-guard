import React from 'react';
import { Button } from '@/ui/Button';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';
import {
  setSubStepStatus,
  setSubStepError,
  selectSubStep,
  setStepStatus,
} from '@/store/features/workflowSlice';
import {
  screenshareRequestHandlerReact,
  screenshareCleanup,
  isScreenShareValid,
} from '@/utils/screenshotV2';
import { ERRORS, ERROR_MESSAGES } from '@/constants/screenshot';
import { AlertTriangle } from 'lucide-react';

export default function ScreenShareCard() {
  const dispatch = useAppDispatch();
  const screenShareState = useAppSelector((state) =>
    selectSubStep(state, 'screenShare', 'screenShare')
  );

  const handleScreenShareSuccess = () => {
    dispatch(
      setSubStepStatus({
        step: 'screenShare',
        subStep: 'screenShare',
        status: 'completed',
        clearError: true,
      })
    );
    dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'completed',
      })
    );
  };

  const handleScreenShareFailure = (errorCode: string) => {
    const errorMessage =
      ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES] ||
      'Screen share validation failed. Please try again.';

    dispatch(
      setSubStepError({
        step: 'screenShare',
        subStep: 'screenShare',
        error: errorMessage,
      })
    );
    dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'error',
      })
    );
  };

  const handleScreenShareEnd = () => {
    dispatch(
      setSubStepStatus({
        step: 'screenShare',
        subStep: 'screenShare',
        status: 'pending',
        clearError: true,
      })
    );
    dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'pending',
      })
    );
  };

  const handleShare = async () => {
    try {
      await screenshareRequestHandlerReact.call({
        handleScreenShareSuccess,
        handleScreenShareFailure,
        handleScreenShareEnd,
        handleScreenshotSuccess: () =>
          console.log('Screenshot captured successfully'),
        handleScreenshotFailure: (err: any) =>
          console.error('Screenshot capture failed', err),
        screenshotConfig: {
          frequency: 3000,
          resizeTo: { width: 1280, height: 720 },
        },
      });
    } catch (error) {
      console.error('Error initiating screen share:', error);
      const errorCode =
        error instanceof Error ? error.message : ERRORS.SCREEN_SHARE_FAILED;
      handleScreenShareFailure(errorCode);
    }
  };

  const handleStop = () => {
    screenshareCleanup();
    dispatch(
      setSubStepStatus({
        step: 'screenShare',
        subStep: 'screenShare',
        status: 'pending',
        clearError: true,
      })
    );
    dispatch(
      setStepStatus({
        step: 'screenShare',
        status: 'pending',
      })
    );
  };

  return (
    <div className='mt-8 w-full max-w-6xl'>
      {screenShareState.status === 'error' && screenShareState.error && (
        <div className='w-full bg-red-100 p-4 rounded-t-2xl flex items-center justify-center gap-2'>
          <AlertTriangle className='w-6 h-6 text-red-500' />
          <span className='text-red-700'>{screenShareState.error}</span>
        </div>
      )}

      <div
        className={`${
          screenShareState.status === 'error' ? 'rounded-b-lg' : 'rounded-2xl'
        } overflow-hidden shadow-lg bg-white`}
      >
        <div className='flex'>
          <div className='flex-1 p-16'>
            <h3 className='text-xl font-semibold mb-2'>
              {screenShareState.status === 'completed'
                ? 'Screen Sharing Successfully Checked'
                : 'Check your Screen Share Permissions'}
            </h3>
            <p className='text-gray-400 mb-6 text-sm'>
              Screen Sharing is essential to make sure the test is happening in
              the fair manner
            </p>
            {screenShareState.status === 'completed' ? (
              <div className='flex items-center justify-between p-4 bg-gray-100 rounded-2xl'>
                <span>scaler.com is sharing your screen</span>
                <div className='flex gap-2'>
                  <Button
                    onClick={handleStop}
                    className='bg-blue-500 text-white'
                    variant='primary'
                  >
                    Stop Sharing
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleShare}
                className='bg-blue-500 text-white'
                variant='primary'
              >
                Share Entire Screen
              </Button>
            )}
            <p className='mt-4 text-sm text-primary italic'>
              Need help?{' '}
              <a href='#' className='text-blue-500 underline'>
                Click to view
              </a>{' '}
              screen sharing setup guide
            </p>
          </div>

          {screenShareState.status !== 'completed' && (
            <div className='flex-1 bg-gray-200 m-6'></div>
          )}
        </div>
      </div>
    </div>
  );
}
