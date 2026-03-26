'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMeetingById } from '@/entities/meet/api/getMeetingById';
import { updateVote } from '@/entities/meet/api/updateVote';
import { useDateSelection } from '@/features/host-range-selector/model/useDateSelection';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { parseDate } from '@/shared/lib/date';

export function useParticipantEditDate(meetingId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 이전 단계(이름 입력)에서 넘겨받은 이름
  const nameFromQuery = searchParams.get('name');
  // 로컬 스토리지에서 이름 가져오기 (새로고침 등 대비)
  const STORE_KEY = `last_participant_name_${meetingId}`;

  const [participantName, setParticipantName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAllImpossible, setIsAllImpossible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useDateSelection 훅 재사용 (날짜 선택/제거 로직)
  // formattedDates: "YYYY-MM-DD" 배열 (정렬됨)
  const {
    selectedDates,
    handleDateChange,
    setSelectedDates,
    formattedDatesRef,
  } = useDateSelection();

  // 모임 정보 (가능한 날짜 범위 등)
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [meetingTitle, setMeetingTitle] = useState('');

  // ReactDatepickerAdapter에 전달할 가능 날짜 (Date[])
  const availableDatesForCalendar = availableDates.map((d) => parseDate(d));

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
      router.replace(`/meet/${meetingId}/edit`);
      return;
    }
    setParticipantName(currentName);

    // 2. 데이터 로드
    const fetchData = async () => {
      try {
        const data = await getMeetingById(meetingId);
        setMeetingTitle(data.title);
        setAvailableDates(data.dates); // 모임장이 설정한 가능 날짜들

        // 해당 참여자의 기존 투표 정보 찾기
        const participant = data.participants.find(
          (p) => p.name === currentName,
        );
        if (participant) {
          // string[] -> Date[] 변환하여 설정
          const voteDatesAsDates = participant.voteDates.map((d) =>
            parseDate(d),
          );
          setSelectedDates(voteDatesAsDates);
        } else {
          // 참여 이력이 확인되지 않는 경우 (이름은 맞는데 리스트에 없음 - 드문 케이스)
          // 에러 처리 혹은 초기화
          console.error('Participant not found');
          // alert('참여 정보를 찾을 수 없습니다.');
          // router.replace(`/meet/${meetingId}/edit`);
        }
      } catch (error) {
        console.error('Failed to fetch meeting data:', error);
        // alert('데이터를 불러오는 데 실패했습니다.');
        // router.push(`/meet/${meetingId}`);
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

  const successModal = useDisclosure();

  const handleBack = () => {
    const params = new URLSearchParams();
    if (participantName) {
      params.set('name', participantName);
    }
    router.replace(`/meet/${meetingId}/edit?${params.toString()}`);
  };

  const handleSuccessModalClose = () => {
    successModal.close();
    router.replace(`/meet/${meetingId}`);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const datesToSend = isAllImpossible ? [] : formattedDatesRef.current;

      await updateVote({
        meetingId,
        name: participantName,
        voteDates: datesToSend,
      });

      // 성공 시 완료 모달 노출
      successModal.open();
    } catch (error) {
      console.error('Failed to update vote:', error);
      alert('투표 수정에 실패했습니다. 다시 시도해주세요.');
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
    onDateClick: (updater: (prev: Date[]) => Date[]) => {
      if (isAllImpossible) {
        setIsAllImpossible(false);
      }
      handleDateChange(updater);
    },
    handleBack,
    handleSubmit,
    isSuccessModalOpen: successModal.isOpen,
    handleSuccessModalClose,
  };
}
