'use client';

import { ReactDatepickerAdapter } from '@/features/host-range-selector/ui/ReactDatepickerAdapter';
import Button from '@/shared/ui/button/Button';
import Checkbox from '@/shared/ui/checkbox/Checkbox';
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
  } = useParticipantEditDate(meetingId);

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

      <main className='flex flex-1 flex-col px-5 pt-6 pb-10'>
        {/* 2-2. 안내 문구 */}
        <h1 className='text-title-4 text-text-primary mb-6'>
          달력에서 가능한 날짜를
          <br />
          모두 선택해주세요
        </h1>

        {/* 2-3. 월 단위 캘린더 */}
        <div className='relative mb-6 flex flex-1 justify-center'>
          {/* 
            TODO: ReactDatepickerAdapter에 '가능한 날짜(availableDates)'만 활성화하는 기능 추가 고려 
            현재는 단순히 날짜 선택 로직만 연결.
            불참 상태일 때 disabled 처리를 위해 overlay 등을 사용할 수도 있고, 
            Adapter가 disabled prop을 받으면 좋음.
          */}
          <ReactDatepickerAdapter
            selectedDates={selectedDates}
            onChange={onDateClick}
            availableDates={availableDates}
          />

          {/* 불참 체크 시 캘린더 비활성 (오버레이 처리) */}
          {isAllImpossible && (
            <div className='absolute inset-0 z-10 bg-white/50' />
          )}
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
            <span className='text-body-2 text-text-secondary select-none'>
              모든 날짜에 참여가 어려워요
            </span>
          </div>
        </div>

        <div className='flex-1' />

        {/* 2-5. CTA 영역 */}
        <Button onClick={handleSubmit} disabled={!isCtaActive} fullWidth>
          투표하기
        </Button>
      </main>
    </div>
  );
}
