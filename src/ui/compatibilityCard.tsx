import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/ui/button';
import Loader from '@/ui/loader';
import {
  screenshareRequestHandler,
  screenshareCleanup,
} from '@/utils/screenshotV2';

export default function CompatibilityCard() {
  const [status, setStatus] = useState<'initial' | 'active' | 'error'>(
    'initial'
  );

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      screenshareCleanup();
    };
  }, []);

  const handleScreenShareSuccess = () => {
    setStatus('active');
  };

  const handleScreenShareFailure = () => {
    setStatus('error');
  };

  const handleScreenShareEnd = () => {
    setStatus('initial');
  };

  const handleShare = async () => {
    try {
      await screenshareRequestHandler.call({
        handleScreenShareSuccess,
        handleScreenShareFailure,
        handleScreenShareEnd,
        handleScreenshotSuccess: () =>
          console.log('Screenshot captured successfully'),
        handleScreenshotFailure: (err: any) =>
          console.error('Screenshot capture failed', err),
        screenshotConfig: {
          frequency: 3000, // Example frequency
          resizeTo: { width: 1280, height: 720 }, // Example dimensions
        },
      });
    } catch (error) {
      console.error('Error initiating screen share:', error);
      setStatus('error');
    }
  };

  const handleStop = () => {
    screenshareCleanup();
    setStatus('initial');
  };

  return (
    <div className='mt-8 w-fit'>
      <div className='rounded-lg overflow-hidden shadow-lg w-full'>
        <div className='flex items-center gap-2 p-6 bg-gray-900 text-white rounded-t-lg'>
          {status === 'active' ? (
            <CheckCircle className='text-green-500' />
          ) : status === 'error' ? (
            <AlertTriangle className='text-red-500' />
          ) : (
            <Loader />
          )}
          <h2 className='text-lg'>Screen Sharing Permissions</h2>
        </div>
        <div className='p-8 bg-white rounded-b-lg shadow-md'>
          <h3 className='text-xl font-semibold mb-2'>
            {status === 'active'
              ? 'Screen Sharing Successfully Checked'
              : 'Check your Screen Share Permissions'}
          </h3>
          <p className='text-gray-400 mb-6 text-sm'>
            Screen Sharing is essential to make sure the test is happening in
            the fair manner
          </p>
          {status === 'active' ? (
            <div className='flex items-center justify-between p-4 bg-gray-100 rounded-lg'>
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
        {status === 'error' && (
          <div className='p-4 bg-red-100 text-red-700 rounded-lg mb-4'>
            Screen not shared properly due to system or browser settings
          </div>
        )}
      </div>
    </div>
  );
}
