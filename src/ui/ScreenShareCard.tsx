import React, { useEffect } from 'react';
import { Button } from '@/ui/Button';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';
import { setSubStepError, selectSubStep } from '@/store/features/workflowSlice';
import { screenshareCleanup } from '@/utils/screenshotV2';
import { AlertTriangle } from 'lucide-react';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { ERROR_MESSAGES } from '@/constants/screenshot';

export default function ScreenShareCard() {
  const dispatch = useAppDispatch();
  const proctor = useAppSelector((state) => selectProctor(state));
  const screenShareState = useAppSelector((state) =>
    selectSubStep(state, 'screenShare', 'screenShare'),
  );

  const handleShare = async () => {
    try {
      await proctor?.handleScreenshareRequest();
    } catch (error) {
      console.error('Error initiating screen share:', error);
    }
  };

  const handleStop = () => {
    screenshareCleanup();
    dispatch(
      setSubStepError({
        step: 'screenShare',
        subStep: 'screenShare',
        error: ERROR_MESSAGES.SCREEN_SHARE_DENIED,
      }),
    );
  };

  return (
    <div className='mt-8 w-full max-w-6xl'>
      {screenShareState.status === 'error' && screenShareState.error && (
        <div className='w-full bg-red-100 p-4 rounded-t-2xl flex items-center justify-center gap-2'>
          <AlertTriangle className='w-6 h-6 text-red-500' />
          <span className='text-red-700 text-sm'>{screenShareState.error}</span>
        </div>
      )}

      <div
        className={`${
          screenShareState.status === 'error' ? 'rounded-b-lg' : 'rounded-2xl'
        } overflow-hidden shadow-lg bg-white shadow-gray-200`}
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
              <div className='flex items-center justify-between p-4 bg-gray-100 rounded-2xl text-sm'>
                <span>scaler.com is sharing your screen</span>
                <div className='flex gap-2'>
                  <Button
                    onClick={handleStop}
                    size='xs'
                    variant='secondary'
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
          </div>

          {screenShareState.status !== 'completed' && (
            <div className='flex-1 bg-gray-200 m-6'></div>
          )}
        </div>
      </div>
    </div>
  );
}
