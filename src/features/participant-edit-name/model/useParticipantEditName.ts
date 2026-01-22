'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';

import { checkParticipantExist } from '@/entities/meet/api/checkParticipantExist';

// 상수 정의
const MAX_NAME_LENGTH = 10;
const REGEX_NAME = /^[ㄱ-힣a-zA-Z]*$/; // 한글, 영문만 허용

export function useParticipantEditName(meetingId: string) {
  const router = useRouter();

  // 로컬 스토리지 키
  const STORE_KEY = `last_participant_name_${meetingId}`;

  // 1. 초기 로드 시 로컬 스토리지에서 이름 불러오기 (Lazy Initialization)
  const [name, setName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORE_KEY) || '';
    }
    return '';
  });

  const [errorDetails, setErrorDetails] = useState<{
    isError: boolean;
    message: string;
  }>({ isError: false, message: '' });

  // 로컬 스토리지 업데이트는 이름 변경 시나 API 성공 시 처리
  // 다만 기존 코드에서는 "제출 성공 시"에만 setItem을 했으므로,
  // 여기서는 초기값 로드만 Lazy로 하고, 변경 시마다 저장은 하지 않음 (기획서: 뒤로가기 시 저장 안됨)
  // 따라서 handleSubmit 성공 시에만 setItem 하는 로직 유지.

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 1-1. 최대 글자 수 체크 (추가 입력 차단)
    if (value.length > MAX_NAME_LENGTH) return;

    // 1-2. 허용되지 않은 문자 입력 시 에러 처리 (숫자/특수문자/이모지 등)
    if (!REGEX_NAME.test(value)) {
      setErrorDetails({
        isError: true,
        message: '한글, 영문만 입력 가능해요',
      });
      // 입력값은 업데이트하되 에러 표시 (기획서: 에러 발생 후에도 입력값은 유지됨)
      setName(value);
      return;
    }

    // 에러 해제 조건: 사용자가 수정을 시도하면 일단 에러 해제
    setErrorDetails({ isError: false, message: '' });
    setName(value);
  };

  const handleNameClear = () => {
    setName('');
    setErrorDetails({ isError: false, message: '' });
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    // 빈 값 체크
    if (!trimmedName) {
      setErrorDetails({
        isError: true,
        message: '이름을 입력해주세요',
      });
      return;
    }

    // 서버 중복 확인 (여기서는 "참여 이력이 있는지" 확인)
    try {
      const { isExist } = await checkParticipantExist(meetingId, trimmedName);

      if (isExist) {
        // 성공 케이스: 로컬 스토리지 저장 후 이동
        localStorage.setItem(STORE_KEY, trimmedName);

        // 날짜 수정 페이지로 이동
        // 쿼리 파라미터로 이름을 넘겨줄 수도 있지만, 보안/URL 길이 등을 고려해
        // 다음 페이지에서도 로컬스토리지나 API를 통해 식별하는 것이 좋음.
        // 여기서는 URL에 이름을 노출하지 않고 내부 로직으로 처리하거나,
        // 필요하다면 encodeURIComponent로 넘길 수 있음.
        // 기획서 상 "다음 단계(날짜 수정 화면)로 이동" 이라고만 되어있음.
        // 식별을 위해 encodedName을 쿼리로 넘기는 방식을 채택 (간단한 구현)
        const params = new URLSearchParams();
        params.set('name', trimmedName);
        router.replace(`/meet/${meetingId}/edit/date?${params.toString()}`);
      } else {
        // 실패 케이스: 참여 이력 없음
        setErrorDetails({
          isError: true,
          message: '투표에 참여한 이름이 아니에요',
        });
      }
    } catch (error) {
      console.error('Failed to check participant existence:', error);
      // 포괄적인 에러 처리
      setErrorDetails({
        isError: true,
        message: '잠시 후 다시 시도해주세요',
      });
    }
  };

  const handleBack = () => {
    // 뒤로가기 시 입력 중이던 이름은 저장되지 않음 (기획서)
    router.back();
  };

  return {
    name,
    errorDetails,
    isValidInput: name.length > 0 && !errorDetails.isError, // 1자 이상 + 에러 없음
    maxLength: MAX_NAME_LENGTH,
    handleNameChange,
    handleNameClear,
    handleSubmit,
    handleBack,
  };
}
