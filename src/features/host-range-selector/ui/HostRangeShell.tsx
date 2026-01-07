import { useState } from 'react';

import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';

type HostRangeShellProps = {
  children: React.ReactNode;
  range: { start?: string; end?: string };
  onConfirm: () => void; // Final action
  onChangeVoteType: (auto: boolean) => void; // For demo purpose logic
};

export function HostRangeShell({
  children,
  range,
  onConfirm,
  onChangeVoteType,
}: HostRangeShellProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isValid = !!(range.start && range.end);

  const handleCreateClick = () => {
    if (isValid) setIsSheetOpen(true);
  };

  const handleManualVote = () => {
    onChangeVoteType(false);
    setIsSheetOpen(false);
    alert('직접 투표하기 모드: 주최자도 투표에 참여합니다.');
  };

  const handleAutoVote = () => {
    onChangeVoteType(true);
    setIsSheetOpen(false);
    alert('가능해요 모드: 주최자는 모든 날짜에 가능하다고 표시됩니다.');
  };

  return (
    <div className='relative flex flex-col gap-6 pb-24'>
      {/* 1. Calendar Area */}
      <div className='flex min-h-[400px] justify-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm'>
        {children}
      </div>

      {/* 2. Floating CTA */}
      <div className='fixed right-0 bottom-0 left-0 z-40 flex justify-center border-t bg-white p-4 pb-8 sm:pb-4'>
        <div className='w-full max-w-md'>
          <Button
            className='w-full py-6 text-lg font-bold'
            disabled={!isValid}
            onClick={handleCreateClick}
          >
            모임 만들기
          </Button>
        </div>
      </div>

      {/* 3. Bottom Sheet */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title='선택한 날짜에 모두 참여 가능한가요?'
      >
        <div className='flex flex-col gap-4'>
          <p className='mb-2 text-slate-600'>
            {range.start} ~ {range.end} <br />
            모두 가능한 경우, 자동으로 투표에 반영해드려요.
          </p>

          <div className='grid grid-cols-2 gap-3'>
            <Button
              variant='secondary'
              onClick={handleManualVote}
              className='py-6'
            >
              직접 투표하기
            </Button>
            <Button onClick={handleAutoVote} className='py-6'>
              가능해요
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
