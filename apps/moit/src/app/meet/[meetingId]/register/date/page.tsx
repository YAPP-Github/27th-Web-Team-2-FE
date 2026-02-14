import { type Metadata, type ResolvingMetadata } from 'next';

import ParticipantRegisterDatePage from '@/features/participant-register-date/ui/ParticipantRegisterDatePage';

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
    title: `일정 선택하기 - ${meetingId}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;

  return <ParticipantRegisterDatePage meetingId={meetingId} />;
}
