'use client';

import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { trackEvent } from '@/shared/lib/amplitude';
import LinkShareBottomSheet from '@/shared/ui/bottom-sheet/LinkShareBottomSheet';
import RegisterSequenceBottomSheet from '@/shared/ui/bottom-sheet/RegisterSequenceBottomSheet';
import { TopBar } from '@/shared/ui/top-bar';

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
  const {
    isOpen: isShareOpen,
    open: openShare,
    close: closeShare,
  } = useDisclosure();

  const {
    isOpen: isRegisterOpen,
    open: openRegister,
    close: closeRegister,
  } = useDisclosure();

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
      />
    </>
  );
}
