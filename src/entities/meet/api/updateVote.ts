import { api } from '@/shared/api/client';
import { validateSchema } from '@/shared/api/validate';

import {
  type VoteRequest,
  voteRequestDto,
  type VoteResponse,
  voteResponseDto,
} from '../dto/vote.dto';

/**
 * 투표 수정 API
 *
 * @param data 투표 수정 요청 데이터
 * @returns 투표 수정 응답 (스키마 검증 완료)
 */
export async function updateVote(data: VoteRequest): Promise<VoteResponse> {
  const ENDPOINT = '/api/v1/meeting/vote';

  // 1) 요청 바디 스키마 검증 (클라이언트 측 검증)
  const json = voteRequestDto.parse(data);

  // 2) 실제 HTTP 요청 (ky 사용)
  const rawResponse = await api.put(ENDPOINT, { json }).json<unknown>();

  // 3) 응답 스키마 검증
  return validateSchema({
    dto: rawResponse,
    schema: voteResponseDto,
    schemaName: ENDPOINT,
  });
}
