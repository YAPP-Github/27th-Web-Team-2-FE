import { z } from 'zod';

// ==================== Zod Schemas ====================

/**
 * 모임 생성 요청 스키마
 * - API 요청 전 클라이언트 측 검증에 사용
 * - validateSchema로 응답 검증 시에도 사용 가능
 */
export const createMeetRequestDto = z.object({
  title: z.string().min(1, '모임 이름은 필수입니다.'),
  hostName: z.string().min(1, '모임장 이름은 필수입니다.'),
  dates: z.array(z.string()).min(1, '날짜를 선택해주세요.'),
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
});

// ==================== TypeScript Types ====================

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
