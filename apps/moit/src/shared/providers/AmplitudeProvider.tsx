'use client';

import { useEffect } from 'react';

import { initAmplitude } from '@/shared/lib/amplitude';

export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAmplitude();
  }, []);

  return <>{children}</>;
}
