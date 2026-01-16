import MeetCreatePage from '@/features/meet-create/ui/MeetCreatePage';

interface CreateMeetingPageProps {
  searchParams: Promise<{
    hostName?: string;
    meetingName?: string;
  }>;
}

export default async function CreateMeetingPage({
  searchParams,
}: CreateMeetingPageProps) {
  const { hostName, meetingName } = await searchParams;

  return (
    <MeetCreatePage
      initialHostName={hostName || ''}
      initialMeetingName={meetingName || ''}
    />
  );
}
