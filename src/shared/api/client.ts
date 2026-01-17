import ky from 'ky';

export const api = ky.create({
  prefixUrl: '/proxy-api',
  headers: {
    'Content-Type': 'application/json',
  },
});
