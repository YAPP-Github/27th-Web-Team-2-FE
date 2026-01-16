'use client';

import { parseISO } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMeetingById } from '@/entities/meet/api/getMeetingById';
import { voteMeeting } from '@/entities/meet/api/voteMeeting';
import { useDateSelection } from '@/features/host-range-selector/model/useDateSelection';

export function useParticipantRegisterDate(meetingId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 이전 단계(이름 입력)에서 넘겨받은 이름
  const nameFromQuery = searchParams.get('name');
  // 로컬 스토리지에서 이름 가져오기
  const STORE_KEY = `last_participant_name_${meetingId}`;

  const [participantName, setParticipantName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAllImpossible, setIsAllImpossible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useDateSelection 훅 재사용
  const { selectedDates, handleDateChange, setSelectedDates, formattedDates } =
    useDateSelection();

  // 모임 정보
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('');

  // ReactDatepickerAdapter에 전달할 가능 날짜 (Date[])
  const availableDatesForCalendar = availableDates.map((d) => parseISO(d));

  useEffect(() => {
    // 1. 이름 식별
    let currentName = nameFromQuery;
    if (!currentName) {
      if (typeof window !== 'undefined') {
        currentName = localStorage.getItem(STORE_KEY);
      }
    }

    if (!currentName) {
      // 이름 정보가 없으면 이름 입력 화면으로 리다이렉트
      router.replace(`/meet/${meetingId}/register`);
      return;
    }
    setParticipantName(currentName);

    // 2. 데이터 로드
    const fetchData = async () => {
      try {
        const data = await getMeetingById(meetingId);
        setMeetingTitle(data.title);
        setAvailableDates(data.dates); // 모임장이 설정한 가능 날짜들

        // [수정] 등록 모드이므로 기존 참여 이력은 조회하지 않음 (빈 상태로 시작)
        // 만약 '수정하다가 뒤로가기 했다가 다시 온 경우' 등을 고려한다면 localStorage 상태 복구 등이 필요할 수 있으나,
        // 편의상 초기화 상태(선택 안 됨)로 시작
        setSelectedDates([]);
      } catch (error) {
        console.error('Failed to fetch meeting data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [meetingId, nameFromQuery, router, setSelectedDates, STORE_KEY]);

  // "모든 날짜에 참여가 어려워요" 체크박스 핸들러
  const handleAllImpossibleChange = (checked: boolean) => {
    setIsAllImpossible(checked);
    if (checked) {
      // 체크 시 기존 선택 모두 해제
      setSelectedDates([]);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const datesToSend = isAllImpossible ? [] : formattedDates;

      // [수정] 투표 생성 API 호출 (voteMeeting)
      await voteMeeting({
        meetingId,
        name: participantName,
        voteDates: datesToSend,
      });

      // 성공 시 완료 처리
      alert('투표가 완료되었어요!\n지금 투표 현황을 확인해보세요.');
      router.push(`/meet/${meetingId}`);
    } catch (error) {
      console.error('Failed to create vote:', error);
      alert('투표 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CTA 활성 조건: 1일 이상 선택 OR 불참 체크
  const isCtaActive = selectedDates.length > 0 || isAllImpossible;

  return {
    isLoading,
    meetingTitle,
    availableDates: availableDatesForCalendar,
    selectedDates,
    isAllImpossible,
    isSubmitting,
    isCtaActive,
    handleAllImpossibleChange,
    onDateClick: handleDateChange,
    handleBack,
    handleSubmit,
  };
}
