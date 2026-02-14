/**
 * API 응답 스키마 검증 유틸
 * - zod 스키마로 런타임 타입 안정성 확보
 */

import { z } from 'zod';

type ValidateConfig<T extends z.ZodTypeAny> = {
  dto: unknown;
  schema: T;
  schemaName: string;
};

/**
 * API 응답을 zod 스키마로 검증
 * - 성공 시 타입 안전한 데이터 반환
 * - 실패 시 개발 환경에서 상세 에러 로그 출력 후 throw
 */
export const validateSchema = <T extends z.ZodTypeAny>({
  dto,
  schema,
  schemaName,
}: ValidateConfig<T>): z.infer<T> => {
  const { data, success, error } = schema.safeParse(dto);

  if (success) {
    return data;
  }

  // 개발 환경에서만 상세 에러 로그 출력
  if (process.env.NODE_ENV !== 'production') {
    console.error(`API Validation Error: ${schemaName}`, {
      dto,
      error: error.message,
      issues: error.issues,
    });
  }

  throw error;
};
