import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/ui/Cardd';

const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    containerClassName?: string;
    modalClassName?: string;
    isOpen: boolean;
  }
>(({ containerClassName, modalClassName, isOpen, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'fixed inset-0 bg-black/50 flex items-center justify-center p-4',
      isOpen ? '' : 'hidden',
      containerClassName
    )}
    {...props}
  >
    <Card className={modalClassName}>{children}</Card>
  </div>
));

Modal.displayName = 'Modal';

export { Modal };
