'use client';

import { useDisclosure } from '@repo/shared/hooks/useDisclosure';
import LinkShareBottomSheet from '@repo/shared/ui/bottom-sheet/LinkShareBottomSheet';
import TopBar from '@repo/shared/ui/top-bar/TopBar';
import { useState } from 'react';

export default function BottomSheetTestPage() {
  const { isOpen, open, close } = useDisclosure();
  const [currentUrl] = useState('http://moyo.com/vote/link');

  return (
    <div className='min-h-screen bg-gray-50'>
      <TopBar
        title='Bottom Sheet Test'
        rightIcon='ic_people' // 임의의 아이콘 사용
        onRightClick={open}
      />

      <div className='p-4'>
        <p className='text-body-1 text-gray-700'>
          TopBar의 우측 아이콘을 클릭하여 바텀 시트를 열어보세요.
        </p>
        <button
          onClick={open}
          className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-white'
        >
          바텀 시트 열기 버튼
        </button>
      </div>

      <LinkShareBottomSheet isOpen={isOpen} onClose={close} url={currentUrl} />
    </div>
  );
}
