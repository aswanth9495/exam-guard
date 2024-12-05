import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/Dialog';
import { useState, useEffect } from 'react';

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

  const shouldShow = isError ? (open && !userDismissed) : open;

  return (
    <Dialog open={shouldShow} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[1000px] p-12 z-[100] bg-white'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
