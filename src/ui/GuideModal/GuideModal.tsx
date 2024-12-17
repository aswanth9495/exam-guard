import { useMemo } from 'react';
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
  title,
  children,
}: GuideModalProps) {

  const browserInfo: any = useMemo(() => getBrowserInfo(), []);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`max-w-[90%] max-h-[95%] p-12 z-[100] bg-white ${styles.dialogContent} overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
        </DialogHeader>
        {children}

        <div className='my-4'>
          <div className='flex flex-wrap items-center text-sm'>
            <div className='flex flex-col mr-6'>
              <span className='font-bold text-base-500'>Browser</span>
              <span className='text-gray-900'>{browserInfo?.name}</span>
            </div>
            <div className='flex flex-col mr-6'>
              <span className='font-bold text-base-500'>Version</span>
              <span className='text-gray-900'>{browserInfo?.version}</span>
            </div>
            <div className='flex flex-col'>
              <span className='font-bold text-base-500'>Supported</span>
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
