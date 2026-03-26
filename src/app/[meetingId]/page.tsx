interface MeetingPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { meetingId } = await params;

  return (
    <div className='min-h-screen-safe flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-headline-1 text-text-primary mb-4'>
          모임 투표 페이지
        </h1>
        <p className='text-body-1 text-text-secondary mb-2'>
          모임 ID: {meetingId}
        </p>
      </div>
    </div>
  );
}
