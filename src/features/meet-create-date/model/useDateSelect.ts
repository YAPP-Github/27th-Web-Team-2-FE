'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createMeeting } from '@/entities/meet/api/createMeeting';
import { updateVote } from '@/entities/meet/api/updateVote';

export function useDateSelect(hostName: string, meetingName: string) {
  const router = useRouter();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

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
      setCreatedMeetingId(response.id);
      setSelectedDates(formattedDates);
      setIsBottomSheetOpen(true);
    } catch (error) {
      console.error('모임 생성 실패:', error);
      alert('모임 생성에 실패했습니다.');
    }
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  const handleDirectVote = () => {
    if (createdMeetingId) {
      router.push(`/meet/${createdMeetingId}`);
    }
  };

  const handleAllAvailable = async () => {
    if (createdMeetingId && selectedDates.length > 0) {
      try {
        await updateVote({
          meetingId: createdMeetingId,
          name: hostName,
          voteDates: selectedDates,
        });
        console.log('주최자 투표 완료');
        // 캐시 무효화를 위해 전체 페이지 새로고침으로 이동
        window.location.href = `/meet/${createdMeetingId}`;
      } catch (error) {
        console.error('투표 실패:', error);
        window.location.href = `/meet/${createdMeetingId}`;
      }
    }
  };

  return {
    handleBack,
    handleNext,
    isBottomSheetOpen,
    handleCloseBottomSheet,
    handleDirectVote,
    handleAllAvailable,
  };
}
