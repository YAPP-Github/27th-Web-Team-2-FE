import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type VoteRequest,
  voteRequestDto,
  type VoteResponse,
  voteResponseDto,
} from '../dto/vote.dto';

/**
 * 투표 생성 API
 *
 * 참여자가 모임에 대한 투표를 제출합니다.
 * 중복된 이름으로 투표할 경우 에러가 발생합니다.
 *
 * @param data 투표 생성 요청 데이터
 * @returns 투표 생성 응답 (스키마 검증 완료)
 */
export async function voteMeeting(data: VoteRequest): Promise<VoteResponse> {
  const ENDPOINT = '/api/v1/meeting/vote';

  // 1) 요청 바디 스키마 검증 (클라이언트 측 검증)
  const json = voteRequestDto.parse(data);

  // 2) 실제 HTTP 요청 (ky 사용)
  const rawResponse = await api.post(ENDPOINT, { json }).json<unknown>();

  // 3) 응답 스키마 검증
  return validateSchema({
    dto: rawResponse,
    schema: voteResponseDto,
    schemaName: ENDPOINT,
  });
}
