'use client';

import { useSearchParams } from 'next/navigation';

import MeetCreatePage from '@/features/meet-create/ui/MeetCreatePage';

export default function CreateMeetingPage() {
  const searchParams = useSearchParams();

  const initialHostName = searchParams.get('hostName') || '';
  const initialMeetingName = searchParams.get('meetingName') || '';

  return (
    <MeetCreatePage
      initialHostName={initialHostName}
      initialMeetingName={initialMeetingName}
    />
  );
}
