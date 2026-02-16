'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { trackEvent } from '@/shared/lib/amplitude';
import LinkShareBottomSheet from '@/shared/ui/bottom-sheet/LinkShareBottomSheet';
import RegisterSequenceBottomSheet from '@/shared/ui/bottom-sheet/RegisterSequenceBottomSheet';
import TopBar from '@/shared/ui/top-bar/TopBar';

interface ParticipantHeaderProps {
  title: string;
  url: string;
  className?: string;
}

export default function ParticipantHeader({
  title,
  url,
  className,
}: ParticipantHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const shouldOpenShare = searchParams.get('trigger') === 'share';

  const {
    isOpen: isShareOpen,
    open: openShare,
    close: closeShare,
  } = useDisclosure(shouldOpenShare);

  const {
    isOpen: isRegisterOpen,
    open: openRegister,
    close: closeRegister,
  } = useDisclosure();

  useEffect(() => {
    if (shouldOpenShare) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('trigger');
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [shouldOpenShare, pathname, router, searchParams]);

  const handleOpenShare = () => {
    trackEvent('modal_share_sheet_open', { entry_point: 'main_top' });
    openShare();
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <TopBar
          title={title}
          leftIcon='ic_calendar_add'
          onLeftClick={openRegister}
          rightIcon='ic_other_share'
          onRightClick={handleOpenShare}
        />
      </div>

      <LinkShareBottomSheet
        isOpen={isShareOpen}
        onClose={closeShare}
        url={url}
      />

      <RegisterSequenceBottomSheet
        isOpen={isRegisterOpen}
        onClose={closeRegister}
        onConfirm={() => router.push('/create')}
      />
    </>
  );
}
