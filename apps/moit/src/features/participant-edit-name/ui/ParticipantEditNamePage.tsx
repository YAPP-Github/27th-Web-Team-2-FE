'use client';

import Input from '@repo/shared/ui/input/Input';
import TopBar from '@repo/shared/ui/top-bar/TopBar';

import { trackEvent } from '@/shared/lib/amplitude';
import Button from '@/shared/ui/button/Button';
import { Header } from '@/shared/ui/header/Header';

import { useParticipantEditName } from '../model/useParticipantEditName';

interface ParticipantEditNamePageProps {
  meetingId: string;
}

export default function ParticipantEditNamePage({
  meetingId,
}: ParticipantEditNamePageProps) {
  const {
    name,
    errorDetails,
    isValidInput,
    maxLength,
    handleNameChange,
    handleNameClear,
    handleSubmit,
    handleBack,
  } = useParticipantEditName(meetingId);

  const handleNameBlur = () => {
    if (name.trim()) {
      trackEvent('voter_name_input_edit');
    }
  };

  const handleSubmitWithTracking = () => {
    trackEvent('voter_name_input_completed_cta_click');
    handleSubmit();
  };

  return (
    <div className='bg-gray-0 flex min-h-screen flex-col'>
      {/* 2. 상단 영역 */}
      <TopBar
        title='투표 수정하기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />
      <Header
        variant='subHeader'
        title={'투표에 참여했던\n이름을 입력해주세요'}
      />

      <main className='flex flex-1 flex-col px-5 pt-1 pb-10'>
        {/* 설명 (기획서에는 별도 설명 텍스트 언급 없으나, UI 흐름 상 필요하면 추가) */}
        {/* 2-2. 이름 입력 영역 */}
        <div className='mt-1 flex flex-col gap-1.5'>
          <Input
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onClear={handleNameClear}
            placeholder='투표에 참여했던 이름을 입력해주세요'
            maxLength={maxLength}
            fullWidth
            required
            autoFocus // 화면 진입 시 자동 포커스
            errorMessage={
              errorDetails.isError ? errorDetails.message : undefined
            }
          />
        </div>

        <div className='flex-1' />

        {/* 2-3. CTA 영역 */}
        <Button
          onClick={handleSubmitWithTracking}
          disabled={!isValidInput}
          fullWidth
        >
          일정 수정하기
        </Button>
      </main>
    </div>
  );
}
