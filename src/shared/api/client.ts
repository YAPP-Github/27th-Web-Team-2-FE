import ky from 'ky';

/**
 * 공통 HTTP 클라이언트
 * - 개발 환경에서는 CORS 우회를 위해 Next.js rewrites 프록시 사용
 * - 프로덕션에서는 직접 API 호출
 */

const isDev = process.env.NODE_ENV === 'development';
const BASE_URL = isDev
  ? '/proxy-api' // Next.js rewrites 프록시
  : process.env.NEXT_PUBLIC_API_BASE_URL_SANDBOX;

if (!BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL_SANDBOX가 설정되어 있지 않습니다. .env 파일을 확인해주세요.',
  );
}

/**
 * ky 인스턴스
 * - 사용 예: api.get('v1/meeting/123').json()
 */
export const api = ky.create({
  prefixUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
