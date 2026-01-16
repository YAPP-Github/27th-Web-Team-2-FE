import { type Metadata, type ResolvingMetadata } from 'next';

import ParticipantEditNamePage from '@/features/participant-edit-name/ui/ParticipantEditNamePage';

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
    title: `투표 수정하기 - ${meetingId}`, // TODO: 실제 모임 제목을 가져오면 좋음
  };
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;

  return <ParticipantEditNamePage meetingId={meetingId} />;
}
