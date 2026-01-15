'use client';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import LinkShareBottomSheet from '@/shared/ui/bottom-sheet/LinkShareBottomSheet';
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

  const handleRightClick = () => {
    openShare();
  };

  return (
    <>
      <TopBar
        title={title}
        rightIcon='ic_other_share'
        onRightClick={handleRightClick}
        className={className}
      />
      <LinkShareBottomSheet
        isOpen={isShareOpen}
        onClose={closeShare}
        url={url}
      />
    </>
  );
}
