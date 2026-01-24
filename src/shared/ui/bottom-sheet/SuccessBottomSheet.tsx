'use client';

import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';

interface SuccessBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle: string;
}

export default function SuccessBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
}: SuccessBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center justify-center pb-5'>
        <div className='mb-6 flex flex-col items-center gap-1 text-center'>
          <h2 className='text-headline-5 text-text-primary whitespace-pre-wrap'>
            {title}
          </h2>
          <p className='text-body-2 text-text-tertiary whitespace-pre-wrap'>
            {subtitle}
          </p>
        </div>

        <Button
          onClick={onConfirm}
          fullWidth
          className='bg-gray-800 text-white hover:bg-gray-900'
        >
          확인
        </Button>
      </div>
    </BottomSheet>
  );
}
