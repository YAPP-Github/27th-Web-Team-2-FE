import ky from 'ky';

export const api = ky.create({
  prefixUrl:
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : '/proxy-api',
  headers: {
    'Content-Type': 'application/json',
  },
});
