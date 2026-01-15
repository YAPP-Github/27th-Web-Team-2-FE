import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type CheckParticipantExistResponse,
  checkParticipantExistResponseDto,
} from '../dto/meet.dto';

/**
 * 참여자 이름 중복 확인 API
 *
 * @param meetId 모임 고유 ID
 * @param name 확인할 참여자 이름
 * @returns 중복 여부 (스키마 검증 완료)
 */
export async function checkParticipantExist(
  meetId: string,
  name: string,
): Promise<CheckParticipantExistResponse> {
  const ENDPOINT = `/api/v1/meeting/participant/exist`;

  // 1) 실제 HTTP 요청 (query parameters로 meetId와 name 전달)
  const rawResponse = await api
    .get(ENDPOINT, {
      searchParams: { meetId, name },
    })
    .json<unknown>();

  // 2) 응답 스키마 검증
  return validateSchema({
    dto: rawResponse,
    schema: checkParticipantExistResponseDto,
    schemaName: ENDPOINT,
  });
}
