import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/Dialog';
import { getBrowserInfo } from '@/utils/browser';
import styles from './GuideModal.module.scss';

interface GuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isError?: boolean;
  title: string;
  children: React.ReactNode;
}

export default function GuideModal({
  open,
  onOpenChange,
  isError = false,
  title,
  children,
}: GuideModalProps) {
  const [userDismissed, setUserDismissed] = useState(false);

  const browserInfo: any = useMemo(() => getBrowserInfo(), []);

  useEffect(() => {
    if (!isError) {
      setUserDismissed(false);
    }
  }, [isError]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUserDismissed(true);
    }
    onOpenChange(newOpen);
  };

  const shouldShow = isError ? open && !userDismissed : open;

  return (
    <Dialog open={shouldShow} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`max-w-[90%] max-h-[90%] p-12 z-[100] bg-white ${styles.dialogContent} overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
        </DialogHeader>
        {children}

        <div className='mt-4'>
          <div className='flex flex-wrap items-center text-sm'>
            <div className='flex flex-col mr-6'>
              <span className='font-bold text-gray-700'>Browser</span>
              <span className='text-gray-900'>{browserInfo?.name}</span>
            </div>
            <div className='flex flex-col mr-6'>
              <span className='font-bold text-gray-700'>Version</span>
              <span className='text-gray-900'>{browserInfo?.version}</span>
            </div>
            <div className='flex flex-col'>
              <span className='font-bold text-gray-700'>Supported</span>
              <span
                className={`text-gray-900 ${browserInfo?.isSupported ? 'text-green-600' : 'text-red-600'}`}
              >
                {browserInfo?.isSupported ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
