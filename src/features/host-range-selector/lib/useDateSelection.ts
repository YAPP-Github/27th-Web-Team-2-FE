import { format, parseISO } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { toggleDatesSmart } from './dateUtils';

/**
 * ReactDatepickerAdapter를 위한 날짜 선택 관리 커스텀 훅
 * - Date[] 상태를 관리하며 API 요청을 위한 "yyyy-MM-dd" 형식의 문자열 배열을 제공합니다.
 */
export const useDateSelection = (initialDateStrings: string[] = []) => {
  // 초기값으로 전달된 "yyyy-MM-dd" 문자열을 Date 객체로 변환하여 상태 초기화
  const [selectedDates, setSelectedDates] = useState<Date[]>(() =>
    initialDateStrings.map((dateStr) => parseISO(dateStr)),
  );

  // 계산된 값: "2026-01-14" 형식의 문자열 배열
  const formattedDates = useMemo(() => {
    return selectedDates.map((date) => format(date, 'yyyy-MM-dd')).sort(); // 일관된 출력을 위해 정렬
  }, [selectedDates]);

  /**
   * Adapter로부터 변경된 날짜 배열을 받아 상태를 업데이트합니다.
   * (ReactDatepickerAdapter 내부의 드래그 로직 등에 의해 계산된 최종 Date[]를 받음)
   */
  const handleDateChange = useCallback((newDates: Date[]) => {
    // UX를 위해 시간순 정렬
    const sortedDates = [...newDates].sort((a, b) => a.getTime() - b.getTime());
    setSelectedDates(sortedDates);
  }, []);

  /**
   * 특정 날짜를 토글합니다 (Adapter 외부에서 개별 클릭 등으로 제어할 경우 사용)
   */
  const toggleDate = useCallback((date: Date) => {
    setSelectedDates((prev) => toggleDatesSmart(prev, [date]));
  }, []);

  return {
    selectedDates, // <ReactDatepickerAdapter selectedDates={...} /> 에 전달
    formattedDates, // API 요청 페이로드용: { voteDates: formattedDates }
    handleDateChange, // <ReactDatepickerAdapter onChange={...} /> 에 전달
    toggleDate, // 필요 시 사용
    setSelectedDates, // 직접 상태 설정이 필요할 경우
  };
};
