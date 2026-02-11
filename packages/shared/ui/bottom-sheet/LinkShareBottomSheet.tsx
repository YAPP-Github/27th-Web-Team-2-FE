'use client';

import { trackEvent } from '@repo/shared/lib/amplitude';
import BottomSheet from '@repo/shared/ui/bottom-sheet/BottomSheet';
import Button from '@repo/shared/ui/button/Button';
import Chip from '@repo/shared/ui/chip/Chip';
import Toast from '@repo/shared/ui/toast/Toast';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface LinkShareBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
  shareTitle?: string;
  copyButtonText?: string;
  shareButtonText?: string;
  copySuccessMessage?: string;
  entryPoint?: string;
}

export default function LinkShareBottomSheet({
  isOpen,
  onClose,
  url,
  title = '모임을 공유하시겠어요?',
  description = '더 많은 친구들에게 모임을 공유해보세요',
  shareTitle = '모임 투표 링크',
  copyButtonText = '복사',
  shareButtonText = '링크 공유하기',
  copySuccessMessage = '주소가 복사되었어요',
  entryPoint = 'main_top',
}: LinkShareBottomSheetProps) {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    trackEvent('modal_link_copy_click');
    copy(url);
    setShowToast(true);

    setTimeout(() => {
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
        <div className='flex flex-col items-center pt-6 pb-5 text-center'>
          <h2 className='text-headline-5 mb-1 text-gray-900'>{title}</h2>
          <p className='text-body-2 mb-5 text-gray-500'>{description}</p>

          {/* Link Box */}
          <div className='w-full px-5'>
            <div className='mb-5 flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-3'>
              <span className='text-body-4 truncate text-gray-500'>{url}</span>
              <Chip
                text={copyButtonText}
                variant='line'
                size='sm'
                selected
                onClick={handleCopy}
                className='ml-3'
              />
            </div>
          </div>
          <Button
            fullWidth
            onClick={handleShare}
            className='text-body-2 hover:bg-opacity-90 bg-gray-800'
          >
            {shareButtonText}
          </Button>
        </div>
      </BottomSheet>
      {showToast &&
        createPortal(
          <Toast
            message={copySuccessMessage}
            variant='success'
            className='animate-toast-slide-down fixed top-8 left-1/2 z-[100] -translate-x-1/2'
          />,
          document.body,
        )}
    </>
  );
}
