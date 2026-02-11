'use client';

import BottomSheet from '@repo/shared/ui/bottom-sheet/BottomSheet';
import Button from '@repo/shared/ui/button/Button';

interface RegisterSequenceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

export default function RegisterSequenceBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  title = '새로운 투표 링크를 만드시겠어요?',
  description = '다른 모임 투표 링크가 생성돼요',
  cancelText = '취소',
  confirmText = '새 링크 만들기',
}: RegisterSequenceBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center justify-center px-1 pt-6'>
        <h2 className='text-headline-5 mb-1 text-gray-900'>{title}</h2>
        <p className='text-body-2 mb-8 text-gray-500'>{description}</p>

        <div className='flex w-full gap-3'>
          <Button
            fullWidth
            onClick={onClose}
            className='border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          >
            {cancelText}
          </Button>
          <Button
            fullWidth
            onClick={onConfirm}
            className='bg-gray-800 text-white hover:bg-gray-700'
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
