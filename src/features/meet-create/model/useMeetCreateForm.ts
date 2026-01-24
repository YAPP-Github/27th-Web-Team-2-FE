'use client';

import { useState } from 'react';

// 랜덤 모임명 플레이스홀더 목록
const MEETING_NAME_PLACEHOLDERS = [
  '멋쟁이들 모임',
  '우리들의 약속',
  '즐거운 만남',
  '행복한 하루',
  '설레는 모임',
];

const getRandomPlaceholder = () => {
  const randomIndex = Math.floor(
    Math.random() * MEETING_NAME_PLACEHOLDERS.length,
  );
  return MEETING_NAME_PLACEHOLDERS[randomIndex];
};

export function useMeetCreateForm(
  initialHostName = '',
  initialMeetingName = '',
) {
  const [hostName, setHostName] = useState(initialHostName);
  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [hostNameError, setHostNameError] = useState('');

  // useState의 lazy initializer로 마운트 시 한 번만 랜덤값 생성
  // SSR/CSR 불일치는 Input의 suppressHydrationWarning으로 처리
  const [meetingNamePlaceholder] = useState(getRandomPlaceholder);

  const validateHostName = (value: string) => {
    // 한글, 영문(대소문자)만 허용하는 정규식
    const koreanEnglishOnly = /^[ㄱ-힣a-zA-Z]*$/;

    if (value && !koreanEnglishOnly.test(value)) {
      setHostNameError('한글, 영문만 입력 가능해요');
    } else {
      setHostNameError('');
    }
  };

  const handleHostNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHostName(newValue);
    validateHostName(newValue);
  };

  const handleHostNameClear = () => {
    setHostName('');
    setHostNameError('');
  };

  const handleMeetingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingName(e.target.value);
  };

  const handleMeetingNameClear = () => {
    setMeetingName('');
  };

  const isValid = hostName.trim() !== '' && !hostNameError;

  return {
    hostName,
    meetingName,
    meetingNamePlaceholder,
    hostNameError,
    isValid,
    handleHostNameChange,
    handleHostNameClear,
    handleMeetingNameChange,
    handleMeetingNameClear,
  };
}
