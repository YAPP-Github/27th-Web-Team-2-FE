'use client';

import { ReactDatepickerAdapter } from '@/features/host-range-selector/ui/ReactDatepickerAdapter';
import { trackEvent } from '@/shared/lib/amplitude';
import SuccessBottomSheet from '@/shared/ui/bottom-sheet/SuccessBottomSheet';
import Button from '@/shared/ui/button/Button';
import Checkbox from '@/shared/ui/checkbox/Checkbox';
import { Header } from '@/shared/ui/header/Header';
import TopBar from '@/shared/ui/top-bar/TopBar';

import { useParticipantEditDate } from '../model/useParticipantEditDate';

interface ParticipantEditDatePageProps {
  meetingId: string;
}

export default function ParticipantEditDatePage({
  meetingId,
}: ParticipantEditDatePageProps) {
  const {
    isLoading,
    // meetingTitle, // 필요 시 사용
    availableDates,
    selectedDates,
    isAllImpossible,
    // isSubmitting,
    isCtaActive,
    handleAllImpossibleChange,
    onDateClick,
    handleBack,

    handleSubmit,
    isSuccessModalOpen,
    handleSuccessModalClose,
  } = useParticipantEditDate(meetingId);

  const handleDateChangeWithTracking = (updater: (prev: Date[]) => Date[]) => {
    onDateClick((prev) => {
      const next = updater(prev);
      trackEvent('voter_date_edit', {
        vote_type: next.length > 0 ? 'selective' : 'all_disabled',
      });
      return next;
    });
  };

  const handleSubmitWithTracking = () => {
    trackEvent('voter_date_edit_confirm_cta_click');
    handleSubmit();
  };

  const handleSuccessModalCloseWithTracking = () => {
    trackEvent('voter_edit_completed_cta_click');
    handleSuccessModalClose();
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-gray-500'>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className='bg-gray-0 flex min-h-screen flex-col'>
      {/* 2-1. 상단 영역 */}
      <TopBar
        title='일정 수정하기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />
      <Header
        variant='subHeader'
        title={'달력에서 가능한 날짜를\n모두 선택해주세요'}
      />

      <main className='flex flex-1 flex-col px-5 pt-1 pb-10'>
        <div className='relative flex justify-center pb-3'>
          <ReactDatepickerAdapter
            selectedDates={selectedDates}
            onChange={handleDateChangeWithTracking}
            availableDates={availableDates}
            showNextMonthTooltip={true}
          />
        </div>

        {/* 2-4. '모든 날짜에 참여가 어려워요' 체크박스 */}
        <div className='mb-6'>
          <div
            className='flex cursor-pointer items-center gap-2'
            onClick={() => handleAllImpossibleChange(!isAllImpossible)}
          >
            <Checkbox
              checked={isAllImpossible}
              onChange={() => {}} // 부모 div onClick으로 처리
            />
            <span className='text-body-4 text-text-secondary select-none'>
              모든 날짜에 참여가 어려워요
            </span>
          </div>
        </div>

        <div className='flex-1' />

        {/* 2-5. CTA 영역 */}
        <Button
          onClick={handleSubmitWithTracking}
          disabled={!isCtaActive}
          fullWidth
        >
          투표하기
        </Button>
      </main>

      <SuccessBottomSheet
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalCloseWithTracking}
        onConfirm={handleSuccessModalCloseWithTracking}
        title={'투표가 수정되었어요!'}
        subtitle={'지금 투표 현황을 확인해보세요'}
      />
    </div>
  );
}
