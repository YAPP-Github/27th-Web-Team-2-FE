'use client';

import { useDateSelection } from '@/features/host-range-selector/model/useDateSelection';
import { ReactDatepickerAdapter } from '@/features/host-range-selector/ui/ReactDatepickerAdapter';
import { trackEvent } from '@/shared/lib/amplitude';
import BottomSheet from '@/shared/ui/bottom-sheet/BottomSheet';
import Button from '@/shared/ui/button/Button';
import TopBar from '@/shared/ui/top-bar/TopBar';

import { useDateSelect } from '../model/useDateSelect';

interface DateSelectPageProps {
  hostName: string;
  meetingName: string;
}

export default function DateSelectPage({
  hostName,
  meetingName,
}: DateSelectPageProps) {
  const {
    handleBack,
    handleNext,
    isBottomSheetOpen,
    handleCloseBottomSheet,
    handleDirectVote,
    handleAllAvailable,
  } = useDateSelect(hostName, meetingName);
  const { selectedDates, handleDateChange, formattedDates } =
    useDateSelection();

  const handleDateChangeWithTracking = (updater: (prev: Date[]) => Date[]) => {
    handleDateChange((prev) => {
      const next = updater(prev);
      trackEvent('host_date_select', { total_days: next.length });
      return next;
    });
  };

  return (
    <div className='bg-gray-0 min-h-screen-safe flex flex-col'>
      {/* 헤더 */}
      <TopBar
        title='모임 만들기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />

      {/* 메인 콘텐츠 */}
      <main className='flex flex-1 flex-col px-5 pt-6 pb-10'>
        {/* 타이틀 */}
        <h1 className='text-title-4 text-text-primary mb-6'>
          참여자들이 투표할
          <br />
          날짜 범위를 선택해주세요
        </h1>

        {/* 캘린더 영역 */}
        <div className='mb-6 flex flex-1 justify-center'>
          <ReactDatepickerAdapter
            selectedDates={selectedDates}
            onChange={handleDateChangeWithTracking}
          />
        </div>

        {/* CTA 버튼 */}
        <Button
          onClick={() => handleNext(formattedDates)}
          fullWidth
          disabled={selectedDates.length === 0}
        >
          모임 만들기
        </Button>
      </main>

      {/* 바텀시트 */}
      <BottomSheet isOpen={isBottomSheetOpen} onClose={handleCloseBottomSheet}>
        <div className='flex flex-col items-center justify-center px-1 pt-6'>
          <h2 className='text-headline-5 text-text-primary mb-1 text-center'>
            선택한 날짜에 모두 참여 가능한가요?
          </h2>
          <p className='text-body-2 text-text-tertiary mb-8 text-center'>
            모두 가능한 경우, 자동으로 투표에 반영해드려요
          </p>
          <div className='flex w-full gap-3'>
            <Button variant='secondary' fullWidth onClick={handleDirectVote}>
              직접 투표하기
            </Button>
            <Button
              fullWidth
              onClick={handleAllAvailable}
              className='!bg-gray-800 hover:!bg-gray-700'
            >
              모두 가능해요
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
