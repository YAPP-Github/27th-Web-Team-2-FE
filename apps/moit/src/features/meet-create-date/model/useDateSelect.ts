'use client';

import { trackEvent } from '@repo/shared/lib/amplitude';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createMeeting } from '@/entities/meet/api/createMeeting';
import { updateVote } from '@/entities/meet/api/updateVote';

export function useDateSelect(hostName: string, meetingName: string) {
  const router = useRouter();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleBack = () => {
    const params = new URLSearchParams({
      hostName,
      meetingName,
    });
    router.replace(`/create?${params.toString()}`);
  };

  const handleNext = async (formattedDates: string[]) => {
    if (formattedDates.length === 0) {
      alert('날짜를 선택해주세요.');
      return;
    }

    trackEvent('host_create_meeting_cta_click', {
      total_days: formattedDates.length,
    });

    try {
      const response = await createMeeting({
        title: meetingName,
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
    trackEvent('host_direct_vote_cta_click', {
      selection: 'direct_vote',
    });
    if (createdMeetingId) {
      router.replace(`/meet/${createdMeetingId}/register`);
    }
  };

  const handleAllAvailable = async () => {
    trackEvent('host_option_modal_click', {
      selection: 'all_available',
    });
    if (createdMeetingId && selectedDates.length > 0) {
      try {
        await updateVote({
          meetingId: createdMeetingId,
          name: hostName,
          voteDates: selectedDates,
        });
        console.log('주최자 투표 완료');
        // 캐시 무효화를 위해 전체 페이지 새로고침으로 이동
        // LinkShareBottomSheet 표시를 위해 query param 추가
        router.replace(`/meet/${createdMeetingId}?trigger=share`);
      } catch (error) {
        console.error('투표 실패:', error);
        router.replace(`/meet/${createdMeetingId}?trigger=share`);
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
