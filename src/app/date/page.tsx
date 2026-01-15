'use client';

import { useSearchParams } from 'next/navigation';

import DateSelectPageContent from '@/features/meet-create-date/ui/DateSelectPage';

export default function DateSelectPage() {
  const searchParams = useSearchParams();

  const hostName = searchParams.get('hostName') || '';
  const meetingName = searchParams.get('meetingName') || '';

  return (
    <DateSelectPageContent hostName={hostName} meetingName={meetingName} />
  );
}
