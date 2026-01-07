import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib/utils';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 flex items-end justify-center sm:items-center'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity'
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          'animate-in slide-in-from-bottom-full relative w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl duration-300 sm:rounded-2xl',
        )}
      >
        <div className='flex items-center justify-between border-b p-4'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <button
            onClick={onClose}
            className='rounded-full p-2 hover:bg-slate-100'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        <div className='safe-area-bottom p-4'>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
