'use client';

import { useRouter } from 'next/navigation';

export function useDateSelect(hostName: string, meetingName: string) {
  const router = useRouter();

  const handleBack = () => {
    const params = new URLSearchParams({
      hostName,
      ...(meetingName && { meetingName }),
    });
    router.push(`/create?${params.toString()}`);
  };

  const handleNext = () => {
    // TODO: API 연동 - 모임 생성
    console.log({ hostName, meetingName });
  };

  return {
    handleBack,
    handleNext,
  };
}
