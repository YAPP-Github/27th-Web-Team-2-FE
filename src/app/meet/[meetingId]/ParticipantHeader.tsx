'use client';

import { useRouter } from 'next/navigation';

import { useDisclosure } from '@/shared/hooks/useDisclosure';
import LinkShareBottomSheet from '@/shared/ui/bottom-sheet/LinkShareBottomSheet';
import { Menu } from '@/shared/ui/menu';
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
  const router = useRouter();
  const {
    isOpen: isShareOpen,
    open: openShare,
    close: closeShare,
  } = useDisclosure();

  const {
    isOpen: isMenuOpen,
    open: openMenu,
    close: closeMenu,
  } = useDisclosure();

  return (
    <>
      <div className={`relative ${className}`}>
        <TopBar
          title={title}
          leftIcon='ic_hamburger'
          onLeftClick={openMenu}
          rightIcon='ic_other_share'
          onRightClick={openShare}
        />

        <Menu isOpen={isMenuOpen} onClose={closeMenu} className='top-12 left-4'>
          <Menu.Item onClick={() => router.push('/')}>투표 생성하기</Menu.Item>
        </Menu>
      </div>

      <LinkShareBottomSheet
        isOpen={isShareOpen}
        onClose={closeShare}
        url={url}
      />
    </>
  );
}
