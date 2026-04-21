# API Contract: POST /v1/meeting (Time Range 확장)

**Feature**: `feat/#131-time-range-picker`
**Client**: `src/entities/meet/api/createMeeting.ts` (ky, baseURL 공용)
**DTO**: `src/entities/meet/dto/meet.dto.ts` (zod)

본 계약은 `createMeetRequestDto`의 확장과 서버 전송 바디 두 형태(토글 OFF / ON)를 규정한다. 엔드포인트·응답 스키마는 기존과 동일하다.

---

## Endpoint

- **Method**: `POST`
- **Path**: `v1/meeting`
- **Auth**: 기존 방식 유지(서비스 공용 헤더).
- **Content-Type**: `application/json`

---

## Request Body — 토글 OFF

```json
{
  "title": "2월 스터디",
  "hostName": "주최자",
  "dates": ["2026-02-20", "2026-02-21"]
}
```

- `timeRange` 필드가 **포함되지 않아야 한다**. (SC-004: 0%)
- zod 스키마가 `timeRange`를 `.optional()`로 정의하므로 `parse()` 이후에도 키가 존재하지 않는다.

---

## Request Body — 토글 ON

```json
{
  "title": "2월 스터디",
  "hostName": "주최자",
  "dates": ["2026-02-20", "2026-02-21"],
  "timeRange": {
    "startTime": "09:00",
    "endTime": "12:00"
  }
}
```

- `startTime` / `endTime` 모두 정규식 `^([01]\d|2[0-3]):(00|30)$`에 매치되어야 한다.
- `startTime < endTime` (사전식, leading zero 보장).

---

## Validation Schema (zod)

```ts
const TIME_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;

const timeRangeDto = z
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

export const createMeetRequestDto = z.object({
  title: z.string().min(1, '모임 이름은 필수입니다.'),
  hostName: z.string().min(1, '모임장 이름은 필수입니다.'),
  dates: z.array(z.string()).min(1, '날짜를 선택해주세요.'),
  timeRange: timeRangeDto.optional(),
});
```

---

## Response

기존과 동일.

```json
{
  "id": "meet_01HZX..."
}
```

```ts
export const createMeetResponseDto = z.object({ id: z.string() });
```

`createMeeting.ts`는 응답을 `validateSchema({ dto, schema: createMeetResponseDto, schemaName: 'v1/meeting' })`로 검증한 뒤 `CreateMeetResponse`를 반환한다(변경 없음).

---

## Client Call Pattern

```ts
// features/meet-create-date/model/useDateSelect.ts
const timeRangePayload: TimeRangePayload | undefined =
  isTimeRangeEnabled && range
    ? {
        startTime: formatTime(range.startTime),
        endTime: formatTime(range.endTime),
      }
    : undefined;

trackEvent('host_create_meeting_cta_click', {
  total_days: formattedDates.length,
  time_range_enabled: Boolean(timeRangePayload),
  start_time: timeRangePayload?.startTime,
  end_time: timeRangePayload?.endTime,
});

const response = await createMeeting({
  title: meetingName,
  hostName,
  dates: formattedDates,
  timeRange: timeRangePayload, // undefined면 직렬화에서 제외
});
```

---

## Error Cases (클라이언트 기준)

| 상황                            | 감지 방식                                    | 사용자 영향                                        |
| ------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| 날짜 0개                        | CTA 비활성(선행 가드) + zod `dates.min(1)`   | 요청 미발송                                        |
| `timeRange.startTime` 형식 위반 | UI 옵션이 30분 단위만 노출 + zod regex       | 요청 미발송                                        |
| `startTime >= endTime`          | UI에서 옵션 disable + zod `refine`           | 요청 미발송, CTA 비활성(SC-003)                    |
| 토글 OFF인데 `timeRange` 채워짐 | `isTimeRangeEnabled` 가드로 `undefined` 고정 | 해당 경로 발생 불가(SC-004)                        |
| 네트워크/5xx                    | `api.post(...).json()` throw                 | 기존 패턴대로 `alert('모임 생성에 실패했습니다.')` |

---

## Test Plan (Vitest)

1. `createMeetRequestDto.parse({...without timeRange})` → 성공, 결과 객체에 `timeRange` 키 없음.
2. `createMeetRequestDto.parse({..., timeRange: { startTime: '09:00', endTime: '12:00' }})` → 성공.
3. `timeRange: { startTime: '09:15', endTime: '12:00' }` → `regex` 실패.
4. `timeRange: { startTime: '12:00', endTime: '09:00' }` → `refine` 실패.
5. `timeRange: { startTime: '09:00', endTime: '09:00' }` → `refine` 실패(동일 시각).
6. `timeRange: { startTime: '23:30', endTime: '24:00' }` → `regex` 실패(25시 이상 방어).

---

## Change Summary

- 파일 `src/entities/meet/dto/meet.dto.ts`: `timeRangeDto` 추가 + `createMeetRequestDto`에 `timeRange.optional()` 필드 추가 + `TimeRangePayload` export.
- 파일 `src/entities/meet/api/createMeeting.ts`: 코드 변경 없음(확장된 DTO를 통해 자동으로 검증·직렬화).
