'use client';

import Button from '@/shared/ui/button/Button';
import Input from '@/shared/ui/input/Input';
import TopBar from '@/shared/ui/top-bar/TopBar';

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

  return (
    <div className='bg-gray-0 flex min-h-screen flex-col'>
      {/* 2. 상단 영역 */}
      <TopBar
        title='투표 수정하기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />

      <main className='flex flex-1 flex-col px-5 pt-6 pb-10'>
        {/* 설명 (기획서에는 별도 설명 텍스트 언급 없으나, UI 흐름 상 필요하면 추가) */}
        {/* 2-2. 이름 입력 영역 */}
        <div className='mt-1 flex flex-col gap-1.5'>
          <Input
            value={name}
            onChange={handleNameChange}
            onClear={handleNameClear}
            placeholder='투표에 참여했던 이름을 입력해주세요'
            maxLength={maxLength}
            fullWidth
            required
            autoFocus // 화면 진입 시 자동 포커스
            label='이름' // 접근성을 위해 라벨 추가 (화면엔 안 보일 수도 있음 디자인에 따라)
            errorMessage={
              errorDetails.isError ? errorDetails.message : undefined
            }
          />
        </div>

        <div className='flex-1' />

        {/* 2-3. CTA 영역 */}
        <Button onClick={handleSubmit} disabled={!isValidInput} fullWidth>
          일정 수정하기
        </Button>
      </main>
    </div>
  );
}
