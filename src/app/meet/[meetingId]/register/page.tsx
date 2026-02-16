import { type Metadata, type ResolvingMetadata } from 'next';

import ParticipantRegisterNamePage from '@/features/participant-register-name/ui/ParticipantRegisterNamePage';

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
    title: `투표하기 - ${meetingId}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;

  return <ParticipantRegisterNamePage meetingId={meetingId} />;
}
