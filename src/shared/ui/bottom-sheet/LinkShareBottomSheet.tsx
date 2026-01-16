'use client';

import copy from 'copy-to-clipboard';
import { useState } from 'react';

import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';
import Chip from '@/shared/ui/chip/Chip';

interface LinkShareBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
  shareTitle?: string;
  shareText?: string;
}

export default function LinkShareBottomSheet({
  isOpen,
  onClose,
  url,
  title = '모임 투표 링크가 생성됐어요!',
  description = '친구들에게 링크를 공유해 보세요',
  shareTitle = '모임 투표 링크',
  shareText = '모임 투표 링크가 생성됐어요!',
}: LinkShareBottomSheetProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    copy(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: url,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback for desktop or unsupported browsers
      handleCopy();
      alert('공유하기가 지원되지 않는 환경입니다. 링크가 복사되었습니다.');
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center px-5 pt-2 pb-5 text-center'>
        <h2 className='text-headline-5 mb-1 text-gray-900'>{title}</h2>
        <p className='text-body-2 mb-8 text-gray-500'>{description}</p>

        {/* Link Box */}
        <div className='mb-4 flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-3'>
          <span className='text-body-2 truncate text-gray-500'>{url}</span>
          <Chip
            text={isCopied ? '복사완료' : '복사'}
            variant={isCopied ? 'fill' : 'line'}
            size='sm'
            selected
            onClick={handleCopy}
            className='ml-3'
          />
        </div>

        <Button
          fullWidth
          onClick={handleShare}
          className='hover:bg-opacity-90 bg-gray-800 font-bold'
        >
          링크 공유하기
        </Button>
      </div>
    </BottomSheet>
  );
}
