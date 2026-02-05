'use client';

import { useRouter } from 'next/navigation';

import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';

interface RegisterSequenceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterSequenceBottomSheet({
  isOpen,
  onClose,
}: RegisterSequenceBottomSheetProps) {
  const router = useRouter();

  const handleCreateNewLink = () => {
    router.push('/create');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center justify-center px-1 pt-6'>
        <h2 className='text-headline-5 mb-1 text-gray-900'>
          새로운 투표 링크를 만드시겠어요?
        </h2>
        <p className='text-body-2 mb-8 text-gray-500'>
          다른 모임 투표 링크가 생성돼요
        </p>

        <div className='flex w-full gap-3'>
          <Button
            fullWidth
            onClick={onClose}
            className='border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          >
            취소
          </Button>
          <Button
            fullWidth
            onClick={handleCreateNewLink}
            className='bg-gray-800 text-white hover:bg-gray-700'
          >
            새 링크 만들기
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
