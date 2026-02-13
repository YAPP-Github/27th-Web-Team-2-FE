'use client';

import Icon from '@repo/shared/ui/icon/Icon';
import type { PropsWithChildren } from 'react';
import { Drawer } from 'vaul';

import { trackEvent } from '@/shared/lib/amplitude';

interface BottomSheetProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  /**
   * 바텀 시트 내용의 추가 클래스 이름
   */
  className?: string;
  /**
   * 닫기 버튼 렌더링 여부
   * @default true
   */
  showCloseButton?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
}: BottomSheetProps) {
  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay
          className='fixed inset-0 z-50 mx-auto max-w-screen-sm bg-black/50'
          onClick={onClose}
        />
        <Drawer.Content
          className={`bg-gray-0 fixed right-0 bottom-0 left-0 z-50 mx-auto flex max-h-[96%] max-w-screen-sm flex-col rounded-t-lg outline-none ${
            className || ''
          }`}
          aria-describedby={undefined}
        >
          <Drawer.Title className='sr-only'>Bottom Sheet</Drawer.Title>
          <Drawer.Description className='sr-only'>
            This is a bottom sheet component.
          </Drawer.Description>

          {showCloseButton && (
            <button
              type='button'
              onClick={() => {
                trackEvent('modal_x_btn_click');
                onClose();
              }}
              className='text-text-primary absolute top-5 right-5 z-50 flex h-6 w-6 items-center justify-center active:scale-95'
              aria-label='닫기'
            >
              <Icon name='ic_menu_close' size={24} />
            </button>
          )}
          <div className='p-4 pb-8'>{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
