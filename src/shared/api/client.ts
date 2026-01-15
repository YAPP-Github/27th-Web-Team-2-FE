import ky from 'ky';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_SANDBOX;

if (!BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL_SANDBOX가 설정되어 있지 않습니다. .env 파일을 확인해주세요.',
  );
}

export const api = ky.create({
  prefixUrl: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
