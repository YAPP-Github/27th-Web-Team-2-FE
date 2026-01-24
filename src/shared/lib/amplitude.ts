'use client';

import * as amplitude from '@amplitude/analytics-browser';
import * as sessionReplay from '@amplitude/session-replay-browser';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '';

let isInitialized = false;

export const initAmplitude = () => {
  if (isInitialized || typeof window === 'undefined') {
    return;
  }

  amplitude.init(AMPLITUDE_API_KEY, {
    fetchRemoteConfig: true,
    autocapture: {
      attribution: true,
      fileDownloads: true,
      formInteractions: true,
      pageViews: true,
      sessions: true,
      elementInteractions: true,
    },
  });

  // Session Replay 초기화
  sessionReplay.init(AMPLITUDE_API_KEY, {
    sampleRate: 1,
  });

  isInitialized = true;
};

export const trackEvent = (
  eventName: string,
  eventProperties?: Record<string, unknown>,
) => {
  amplitude.track(eventName, eventProperties);
};

export const setUserId = (userId: string) => {
  amplitude.setUserId(userId);
};

export const resetUser = () => {
  amplitude.reset();
};
