import React from 'react';

import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';

interface ConfirmBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (autoVote: boolean) => void;
}

export function ConfirmBottomSheet({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title='선택한 날짜에 모두 참여 가능한가요?'
    >
      <div className='flex flex-col gap-6'>
        <div className='space-y-1'>
          <p className='text-sm text-gray-500'>
            모두 가능한 경우, 자동으로 투표에 반영해드려요
          </p>
        </div>

        <div className='flex gap-3'>
          <Button
            variant='secondary'
            className='flex-1 border-none bg-gray-100 py-4 text-base font-medium text-gray-700 hover:bg-gray-200'
            onClick={() => onConfirm(false)}
          >
            직접 투표하기
          </Button>
          <Button
            className='flex-1 bg-blue-500 py-4 text-base font-medium text-white hover:bg-blue-600'
            onClick={() => onConfirm(true)}
          >
            가능해요
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
