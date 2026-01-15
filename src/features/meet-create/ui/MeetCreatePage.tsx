'use client';

import { useRouter } from 'next/navigation';

import Button from '@/shared/ui/button/Button';
import Input from '@/shared/ui/input/Input';
import TopBar from '@/shared/ui/top-bar/TopBar';

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

  const handleSubmit = () => {
    const params = new URLSearchParams({
      hostName: hostName.trim(),
      ...(meetingName.trim() && { meetingName: meetingName.trim() }),
    });
    router.push(`/date?${params.toString()}`);
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
          <div className='mt-1 flex flex-col gap-1.5'>
            <label className='input-label text-title-8'>
              모임장 이름 <span className='text-status-error'>*</span>
            </label>
            <Input
              value={hostName}
              onChange={handleHostNameChange}
              onClear={handleHostNameClear}
              placeholder='이름을 입력해주세요'
              maxLength={10}
              fullWidth
              required
              errorMessage={hostNameError}
            />
          </div>

          <Input
            label='모임명'
            value={meetingName}
            onChange={handleMeetingNameChange}
            onClear={handleMeetingNameClear}
            placeholder='멋지고 이쁜 모임'
            maxLength={10}
            fullWidth
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
