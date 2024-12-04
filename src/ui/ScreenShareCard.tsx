import React, { useEffect, useState } from 'react';
import { Button } from '@/ui/Button';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxhooks';
import { setSubStepError, selectSubStep } from '@/store/features/workflowSlice';
import { screenshareCleanup } from '@/utils/screenshotV2';
import { AlertTriangle } from 'lucide-react';
import { selectProctor } from '@/store/features/assessmentInfoSlice';
import { ERROR_MESSAGES } from '@/constants/screenshot';
import { getBrowserInfo } from '@/utils/browser';
import GuideModal from '@/ui/GuideModal';

export default function ScreenShareCard() {
  const dispatch = useAppDispatch();
  const proctor = useAppSelector((state) => selectProctor(state));
  const screenShareState = useAppSelector((state) =>
    selectSubStep(state, 'screenShare', 'screenShare'),
  );
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    console.log(getBrowserInfo());
  }, []);

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
          <span className='text-red-700'>{screenShareState.error}</span>
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
            <p className='mt-4 text-sm text-primary-500 italic'>
              Need help?{' '}
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setShowGuideModal(true);
                }}
                className='text-blue-500 underline'
              >
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

      <GuideModal
        open={showGuideModal}
        onOpenChange={setShowGuideModal}
        isError={screenShareState.status === 'error'}
        title="It looks like you're having trouble allowing Screen Sharing Permissions"
      >
        <div className='space-y-6'>
          <p className='text-muted-foreground'>
            Refer to the image below for steps to troubleshoot and grant screen
            sharing permissions
          </p>
          <div className='aspect-[16/9] w-full bg-muted rounded-lg'>
            {/*  */}
          </div>
          <p className='text-sm italic'>
            Need help on sharing screen sharing permissions?{' '}
            <a href='#' className='text-blue-500 hover:underline'>
              Click to view
            </a>{' '}
            setup guide
          </p>
        </div>
      </GuideModal>
    </div>
  );
}
