import { z } from 'zod';

// ==================== Zod Schemas ====================

/** "HH:mm" 패턴: 24시간제, 30분 단위만 허용 */
export const TIME_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;

/**
 * 시간 범위 스키마
 * - startTime < endTime (사전식 비교, leading zero 보장)
 */
export const timeRangeDto = z
  .object({
    startTime: z
      .string()
      .regex(TIME_PATTERN, '시각은 "HH:mm" 형식이어야 합니다.'),
    endTime: z
      .string()
      .regex(TIME_PATTERN, '시각은 "HH:mm" 형식이어야 합니다.'),
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: 'endTime은 startTime보다 커야 합니다.',
    path: ['endTime'],
  });

/**
 * 모임 생성 요청 스키마
 * - API 요청 전 클라이언트 측 검증에 사용
 * - validateSchema로 응답 검증 시에도 사용 가능
 */
export const createMeetRequestDto = z.object({
  title: z.string().min(1, '모임 이름은 필수입니다.'),
  hostName: z.string().min(1, '모임장 이름은 필수입니다.'),
  dates: z.array(z.string()).min(1, '날짜를 선택해주세요.'),
  timeRange: timeRangeDto.optional(),
});

/**
 * 모임 생성 응답 스키마
 * - API 응답 검증에 사용
 */
export const createMeetResponseDto = z.object({
  id: z.string(),
});

/**
 * 참여자 이름 중복 확인 응답 스키마
 */
export const checkParticipantExistResponseDto = z.object({
  isExist: z.boolean(),
});

/**
 * 참여자 정보 스키마
 */
export const participantDto = z.object({
  id: z.number(),
  name: z.string(),
  voteDates: z.array(z.string()),
  hasVoted: z.boolean(),
});

/**
 * 모임 조회 응답 스키마
 */
export const meetResponseDto = z.object({
  id: z.string(),
  title: z.string(),
  dates: z.array(z.string()),
  maxParticipantCount: z.number().nullable(),
  participants: z.array(participantDto),
  hostName: z.string(),
});

// ==================== TypeScript Types ====================

/**
 * 시간 범위 페이로드 타입
 */
export type TimeRangePayload = z.infer<typeof timeRangeDto>;

/**
 * 모임 생성 요청 타입
 * - zod 스키마에서 추론
 */
export type CreateMeetRequest = z.infer<typeof createMeetRequestDto>;

/**
 * 모임 생성 응답 타입
 */
export type CreateMeetResponse = z.infer<typeof createMeetResponseDto>;

/**
 * 참여자 이름 중복 확인 응답 타입
 */
export type CheckParticipantExistResponse = z.infer<
  typeof checkParticipantExistResponseDto
>;

/**
 * 참여자 정보 타입
 */
export type Participant = z.infer<typeof participantDto>;

/**
 * 모임 조회 응답 타입
 */
export type MeetResponse = z.infer<typeof meetResponseDto>;
