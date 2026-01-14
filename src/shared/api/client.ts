import ky from 'ky';

/**
 * 공통 HTTP 클라이언트
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_SANDBOX;

if (!BASE_URL) {
  // 빌드/런타임 초기에 바로 알 수 있도록 예외 처리
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL_SANDBOX가 설정되어 있지 않습니다. .env 파일을 확인해주세요.',
  );
}

/**
 * ky 인스턴스
 * - 사용 예: api.get('api/meeting/123').json()
 */
export const api = ky.create({
  prefixUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
