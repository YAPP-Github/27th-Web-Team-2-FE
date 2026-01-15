import { VoteDateStat } from '../dto/voteDateStat.dto';

// TODO: 실제 API 스펙이 정해지면 이 파일에서 구현합니다.

export type FetchVoteDateStatParams = {
  meetingId: string;
};

export async function fetchVoteDateStat(
  _params: FetchVoteDateStatParams,
): Promise<VoteDateStat[]> {
  throw new Error('fetchVoteDateStat is not implemented yet');
}
