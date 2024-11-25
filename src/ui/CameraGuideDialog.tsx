import { X } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/Dialog';
import { useState, useEffect } from 'react';

interface CameraPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isError?: boolean;
}

export default function CameraPermissionsDialog({
  open,
  onOpenChange,
  isError = false,
}: CameraPermissionsDialogProps) {
  const [userDismissed, setUserDismissed] = useState(false);

  // Reset userDismissed when error state changes
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

  // Only show if explicitly opened or if there's an error and user hasn't dismissed
  const shouldShow = open || (isError && !userDismissed);

  return (
    <Dialog open={shouldShow} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px] p-12'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            It looks like you&apos;re having trouble accessing your camera
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <p className='text-muted-foreground'>
            Refer to the image below for steps to troubleshoot and grant camera
            permissions
          </p>
          <div className='aspect-[16/9] w-full bg-muted rounded-lg'>
            {/*  */}
          </div>
          <p className='text-sm italic'>
            Need help on sharing camera permissions?{' '}
            <a href='#' className='text-blue-500 hover:underline'>
              Click to view
            </a>{' '}
            setup guide
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
