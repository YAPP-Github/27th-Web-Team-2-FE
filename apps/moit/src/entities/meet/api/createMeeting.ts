import { api } from '@repo/shared/api/client';
import { validateSchema } from '@repo/shared/api/validate';

import {
  type CreateMeetRequest,
  createMeetRequestDto,
  type CreateMeetResponse,
  createMeetResponseDto,
} from '../dto/meet.dto';

/**
 * 모임 생성 API
 *
 * @param data 모임 생성 요청 데이터
 * @returns 모임 생성 응답 (스키마 검증 완료)
 */
export async function createMeeting(
  data: CreateMeetRequest,
): Promise<CreateMeetResponse> {
  const ENDPOINT = 'v1/meeting';
  // 1) 요청 바디 스키마 검증 (클라이언트 측 검증)
  const json = createMeetRequestDto.parse(data);

  // 2) 실제 HTTP 요청 (ky 사용)
  const rawResponse = await api.post(ENDPOINT, { json }).json<unknown>();

  // 3) 응답 스키마 검증
  return validateSchema({
    dto: rawResponse,
    schema: createMeetResponseDto,
    schemaName: ENDPOINT,
  });
}
