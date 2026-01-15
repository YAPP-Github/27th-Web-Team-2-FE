'use client';

import { useState } from 'react';

export function useMeetCreateForm(
  initialHostName = '',
  initialMeetingName = '',
) {
  const [hostName, setHostName] = useState(initialHostName);
  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [hostNameError, setHostNameError] = useState('');

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
    hostNameError,
    isValid,
    handleHostNameChange,
    handleHostNameClear,
    handleMeetingNameChange,
    handleMeetingNameClear,
  };
}
