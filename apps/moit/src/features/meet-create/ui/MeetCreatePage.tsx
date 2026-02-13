'use client';

import Input from '@repo/shared/ui/input/Input';
import TopBar from '@repo/shared/ui/top-bar/TopBar';
import { useRouter } from 'next/navigation';

import { trackEvent } from '@/shared/lib/amplitude';
import Button from '@/shared/ui/button/Button';

import { useMeetCreateForm } from '../model/useMeetCreateForm';

interface MeetCreatePageProps {
  initialHostName?: string;
  initialMeetingName?: string;
}

export default function MeetCreatePage({
  initialHostName = '',
  initialMeetingName = '',
}: MeetCreatePageProps) {
  const router = useRouter();
  const {
    hostName,
    meetingName,
    meetingNamePlaceholder,
    hostNameError,
    isValid,
    handleHostNameChange,
    handleHostNameClear,
    handleMeetingNameChange,
    handleMeetingNameClear,
  } = useMeetCreateForm(initialHostName, initialMeetingName);

  const handleBack = () => {
    router.push('/');
  };

  const handleHostNameBlur = () => {
    if (hostName.trim()) {
      trackEvent('host_name_input');
    }
  };

  const handleMeetingNameBlur = () => {
    // 사용자가 직접 입력한 경우에만 이벤트 발생 (is_autofilled: false)
    // 입력하지 않고 플레이스홀더를 사용하는 경우는 handleSubmit에서 처리
    if (meetingName.trim()) {
      trackEvent('host_meeting_name_input', {
        is_autofilled: false,
      });
    }
  };

  const handleSubmit = () => {
    // meetingName이 비어있으면 플레이스홀더 값 사용
    const isUsingPlaceholder = !meetingName.trim();
    const finalMeetingName = meetingName.trim() || meetingNamePlaceholder;

    // 플레이스홀더를 사용하는 경우 (사용자가 입력하지 않은 경우)
    if (isUsingPlaceholder) {
      trackEvent('host_meeting_name_input', {
        is_autofilled: true,
      });
    }

    const params = new URLSearchParams({
      hostName: hostName.trim(),
      meetingName: finalMeetingName,
    });
    router.replace(`/date?${params.toString()}`);
  };

  return (
    <div className='bg-gray-0 flex min-h-screen flex-col'>
      <TopBar
        title='모임 만들기'
        leftIcon='arrow_prev'
        onLeftClick={handleBack}
      />

      <main className='flex flex-1 flex-col px-5 pt-6 pb-10'>
        <h1 className='text-title-4 text-text-primary mb-4'>
          투표를 시작할
          <br />
          모임을 만들어주세요
        </h1>

        <div className='flex flex-col gap-1'>
          <Input
            label='모임장 이름'
            value={hostName}
            onChange={handleHostNameChange}
            onBlur={handleHostNameBlur}
            onClear={handleHostNameClear}
            placeholder='이름을 입력해주세요'
            maxLength={10}
            fullWidth
            required
            errorMessage={hostNameError}
          />

          <Input
            label='모임명'
            value={meetingName}
            onChange={handleMeetingNameChange}
            onBlur={handleMeetingNameBlur}
            onClear={handleMeetingNameClear}
            placeholder={meetingNamePlaceholder}
            maxLength={10}
            fullWidth
            suppressHydrationWarning
          />
        </div>

        <div className='flex-1' />

        <Button onClick={handleSubmit} disabled={!isValid} fullWidth>
          날짜 선택하기
        </Button>
      </main>
    </div>
  );
}
