'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';

import { checkParticipantExist } from '@/entities/meet/api/checkParticipantExist';

// 상수 정의
const MAX_NAME_LENGTH = 10;
const REGEX_NAME = /^[ㄱ-힣a-zA-Z]*$/; // 한글, 영문만 허용

export function useParticipantRegisterName(meetingId: string) {
  const router = useRouter();

  // 로컬 스토리지 키 (등록 시에도 사용하거나, 또는 등록 시에는 굳이 초기값을 안 불러와도 되지만 편의상 유지)
  const STORE_KEY = `last_participant_name_${meetingId}`;

  // 1. 초기값: 등록 화면이므로 빈 값으로 시작하는 게 일반적이나,
  // 기획서상 "자동 채움" 언급이 있으므로 유지.
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

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 1-1. 최대 글자 수 체크
    if (value.length > MAX_NAME_LENGTH) return;

    // 1-2. 허용되지 않은 문자 입력 시 에러 처리
    if (!REGEX_NAME.test(value)) {
      setErrorDetails({
        isError: true,
        message: '한글, 영문만 입력 가능해요',
      });
      setName(value);
      return;
    }

    // 에러 해제
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

    // 서버 중복 확인
    try {
      const { isExist } = await checkParticipantExist(meetingId, trimmedName);

      if (isExist) {
        // [수정] 등록(Register) 모드에서는 이미 존재하는 이름이면 에러 처리
        setErrorDetails({
          isError: true,
          message: '중복되는 이름이에요',
        });
      } else {
        // [수정] 성공 케이스: 중복 아님 -> 다음 단계로 이동
        // 로컬 스토리지는 "등록 완료" 시점이 아니므로 여기서 저장할지 말지 기획에 따라 다르나,
        // "자동 채움"을 위해 성공적인 입력값은 저장해두는 편이 좋음.
        // 다만 기획서에는 "날짜 선택하기 CTA 클릭 성공 시점"에 저장한다고 되어있으므로 여기서 함.
        localStorage.setItem(STORE_KEY, trimmedName);

        const params = new URLSearchParams();
        params.set('name', trimmedName);
        // [수정] 이동 경로: register/date
        router.replace(`/meet/${meetingId}/register/date?${params.toString()}`);
      }
    } catch (error) {
      console.error('Failed to check participant existence:', error);
      setErrorDetails({
        isError: true,
        message: '잠시 후 다시 시도해주세요',
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    name,
    errorDetails,
    isValidInput: name.length > 0 && !errorDetails.isError,
    maxLength: MAX_NAME_LENGTH,
    handleNameChange,
    handleNameClear,
    handleSubmit,
    handleBack,
  };
}
