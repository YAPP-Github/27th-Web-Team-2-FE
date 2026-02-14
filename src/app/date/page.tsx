import DateSelectPageContent from '@/features/meet-create-date/ui/DateSelectPage';

interface DateSelectPageProps {
  searchParams: Promise<{
    hostName?: string;
    meetingName?: string;
  }>;
}

export default async function DateSelectPage({
  searchParams,
}: DateSelectPageProps) {
  const { hostName, meetingName } = await searchParams;

  return (
    <DateSelectPageContent
      hostName={hostName || ''}
      meetingName={meetingName || ''}
    />
  );
}
