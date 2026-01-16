import { type Metadata, type ResolvingMetadata } from 'next';

import ParticipantEditDatePage from '@/features/participant-edit-date/ui/ParticipantEditDatePage';

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { meetingId } = await params;
  return {
    title: `일정 수정하기 - ${meetingId}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;

  return <ParticipantEditDatePage meetingId={meetingId} />;
}
