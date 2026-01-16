import { http, HttpResponse } from 'msw';

import {
  CheckParticipantExistResponse,
  MeetResponse,
} from '@/entities/meet/dto/meet.dto';
import { VoteResponse } from '@/entities/meet/dto/vote.dto';

// Mock Data Store (In-memory)
// 실제 앱에서는 DB에서 가져오겠지만, 여기서는 메모리에 저장
const MOCK_MEETING_ID = '123';

const mockMeeting: MeetResponse = {
  id: MOCK_MEETING_ID,
  title: 'YAPP FE 2팀 회식',
  dates: ['2026-01-20', '2026-01-21', '2026-01-22', '2026-01-23'],
  maxParticipantCount: null,
  participants: [
    { id: 1, name: '김재민', voteDates: ['2026-01-20', '2026-01-21'] },
    { id: 2, name: '이영수', voteDates: ['2026-01-22'] },
  ],
};

export const handlers = [
  // 1. 모임 조회
  http.get('*/v1/meeting', ({ request }) => {
    const url = new URL(request.url);
    const meetId = url.searchParams.get('meetId');

    if (meetId !== MOCK_MEETING_ID) {
      // 일단 편의상 모든 ID에 대해 같은 Mock Data 반환하거나 404
      // return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(mockMeeting);
  }),

  // 2. 참여자 이름 중복(존재) 확인
  http.get('*/v1/meeting/participant/exist', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    if (!name) {
      return new HttpResponse(null, { status: 400 });
    }

    const exists = mockMeeting.participants.some((p) => p.name === name);

    const response: CheckParticipantExistResponse = { isExist: exists };
    return HttpResponse.json(response);
  }),

  // 3. 투표 수정
  http.put('*/v1/meeting/vote', async ({ request }) => {
    const body = (await request.json()) as {
      meetingId: string;
      name: string;
      voteDates: string[];
    };
    const { name, voteDates } = body;

    // 업데이트 로직
    const participantIndex = mockMeeting.participants.findIndex(
      (p) => p.name === name,
    );

    if (participantIndex !== -1) {
      mockMeeting.participants[participantIndex].voteDates = voteDates;
    } else {
      // 혹시 없으면 추가? (수정 로직이므로 에러가 맞지만 Mock 편의상 넘어감)
      // mockMeeting.participants.push({
      //     id: mockMeeting.participants.length + 1,
      //     name,
      //     voteDates
      // })
    }

    const response: VoteResponse = { success: true };
    return HttpResponse.json(response);
  }),
];
