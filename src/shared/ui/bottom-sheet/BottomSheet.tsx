import type { PropsWithChildren } from 'react';

import Icon from '../icon/Icon';

interface BottomSheetProps extends PropsWithChildren {
  onClose: () => void;
}

export default function BottomSheet({ onClose, children }: BottomSheetProps) {
  return (
    <div className='bg-gray-0 flex w-full flex-col rounded-t-xl pb-5 shadow-lg'>
      <div className='flex w-full justify-end pt-4 pr-5'>
        <button
          type='button'
          onClick={onClose}
          className='text-text-primary flex h-6 w-6 items-center justify-center active:scale-95'
          aria-label='닫기'
        >
          <Icon name='ic_menu_close' size={24} />
        </button>
      </div>
      {children}
    </div>
  );
}
