import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { toggleDatesSmart } from '../lib/dateUtils';

/**
 * ReactDatepickerAdapter를 위한 날짜 선택 관리 커스텀 훅
 * - Date[] 상태를 관리하며 API 요청을 위한 "yyyy-MM-dd" 형식의 문자열 배열을 제공합니다.
 */
export const useDateSelection = (initialDateStrings: string[] = []) => {
  // 초기값으로 전달된 "yyyy-MM-dd" 문자열을 Date 객체로 변환하여 상태 초기화
  const [selectedDates, setSelectedDates] = useState<Date[]>(() =>
    initialDateStrings.map((dateStr) => parseISO(dateStr)),
  );

  // 계산된 값: "yyyy-MM-dd" 형식의 문자열 배열
  const formattedDates = useMemo(() => {
    return selectedDates.map((date) => format(date, 'yyyy-MM-dd')).sort();
  }, [selectedDates]);

  // 투표 제출 시 stale state 방지를 위한 동기적 ref 추적
  const selectedDatesRef = useRef<Date[]>(selectedDates);
  const formattedDatesRef = useRef<string[]>(formattedDates);

  useEffect(() => {
    selectedDatesRef.current = selectedDates;
  }, [selectedDates]);

  useEffect(() => {
    formattedDatesRef.current = formattedDates;
  }, [formattedDates]);

  /**
   * Adapter로부터 변경된 날짜 배열을 받아 상태를 업데이트합니다.
   * Date[] 직접 전달 또는 updater function((prev) => Date[]) 패턴을 모두 지원합니다.
   */
  const handleDateChange = useCallback(
    (newDatesOrUpdater: Date[] | ((prev: Date[]) => Date[])) => {
      if (typeof newDatesOrUpdater === 'function') {
        setSelectedDates((prev) => {
          const result = newDatesOrUpdater(prev);
          return [...result].sort((a, b) => a.getTime() - b.getTime());
        });
      } else {
        const sortedDates = [...newDatesOrUpdater].sort(
          (a, b) => a.getTime() - b.getTime(),
        );
        setSelectedDates(sortedDates);
      }
    },
    [],
  );

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
    selectedDatesRef, // 동기적 최신 상태 참조 (제출 시 stale 방지)
    formattedDatesRef, // 동기적 최신 포맷 상태 참조 (제출 시 stale 방지)
  };
};
