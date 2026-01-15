import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import { type MeetResponse, meetResponseDto } from '../dto/meet.dto';

/**
 * 모임 정보 조회 API
 *
 * @param meetId 모임 고유 ID
 * @returns 모임 정보와 참여자 투표 현황 (스키마 검증 완료)
 */
export async function getMeetingById(meetId: string): Promise<MeetResponse> {
  const ENDPOINT = `/api/v1/meeting`;

  // 1) 실제 HTTP 요청 (query parameter로 meetId 전달)
  const rawResponse = await api
    .get(ENDPOINT, {
      searchParams: { meetId },
    })
    .json<unknown>();

  // 2) 응답 스키마 검증
  return validateSchema({
    dto: rawResponse,
    schema: meetResponseDto,
    schemaName: ENDPOINT,
  });
}
