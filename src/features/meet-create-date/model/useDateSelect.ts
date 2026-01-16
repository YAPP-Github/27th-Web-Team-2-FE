'use client';

import { useRouter } from 'next/navigation';

import { createMeeting } from '@/entities/meet/api/createMeeting';

export function useDateSelect(hostName: string, meetingName: string) {
  const router = useRouter();

  // meetingName이 없으면 hostName + "모임"
  const finalMeetingName = meetingName || `${hostName}모임`;

  const handleBack = () => {
    const params = new URLSearchParams({
      hostName,
      ...(meetingName && { meetingName }),
    });
    router.push(`/create?${params.toString()}`);
  };

  const handleNext = async (formattedDates: string[]) => {
    if (formattedDates.length === 0) {
      alert('날짜를 선택해주세요.');
      return;
    }

    try {
      const response = await createMeeting({
        title: finalMeetingName,
        hostName,
        dates: formattedDates,
      });

      console.log('모임 생성 완료:', response);
      // TODO: 생성 완료 후 페이지 이동
      router.push(`/meet/${response.id}`);
    } catch (error) {
      console.error('모임 생성 실패:', error);
      alert('모임 생성에 실패했습니다.');
    }
  };

  return {
    handleBack,
    handleNext,
  };
}
