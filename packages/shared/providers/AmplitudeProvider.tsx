'use client';

import { initAmplitude } from '@repo/shared/lib/amplitude';
import { useEffect } from 'react';

export function AmplitudeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAmplitude();
  }, []);

  return <>{children}</>;
}
