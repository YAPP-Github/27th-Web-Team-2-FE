'use client';

import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { trackEvent } from '@/shared/lib/amplitude';
import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';
import Chip from '@/shared/ui/chip/Chip';
import Toast from '@/shared/ui/toast/Toast';

interface LinkShareBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
  shareTitle?: string;
  entryPoint?: 'host_create' | 'main_top';
}

export default function LinkShareBottomSheet({
  isOpen,
  onClose,
  url,
  title = '모임 투표 링크가 생성됐어요!',
  description = '친구들에게 링크를 공유해 보세요',
  shareTitle = '모임 투표 링크',
  entryPoint = 'main_top',
}: LinkShareBottomSheetProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    trackEvent('modal_link_copy_click');
    copy(url);
    setIsCopied(true);
    setShowToast(true);

    setTimeout(() => {
      setIsCopied(false);
      setShowToast(false);
    }, 2000);
  };

  const handleShare = async () => {
    trackEvent('os_share_cta_click', {
      entry_point: entryPoint,
    });

    const shareData = {
      title: shareTitle,
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
    }
  };

  return (
    <>
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
      {showToast &&
        createPortal(
          <Toast
            message='주소가 복사되었어요'
            variant='success'
            className='fixed top-8 left-1/2 z-[100] -translate-x-1/2'
          />,
          document.body,
        )}
    </>
  );
}
