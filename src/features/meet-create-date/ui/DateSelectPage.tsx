'use client';

import Button from '@/shared/ui/button';
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
  const { handleBack, handleNext } = useDateSelect(hostName, meetingName);

  return (
    <div className='bg-gray-0 flex min-h-screen flex-col'>
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

        {/* 캘린더 영역 (플레이스홀더) */}
        <div className='mb-6 flex flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white'>
          <p className='text-text-tertiary text-body-3'>캘린더 영역</p>
        </div>

        {/* CTA 버튼 */}
        <Button onClick={handleNext} fullWidth>
          모임 만들기
        </Button>
      </main>
    </div>
  );
}
