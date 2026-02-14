'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseMeetingMemoOptions = {
  initialValue?: string;
  maxLength?: number;
  onSave?: (value: string) => void;
  debounceMs?: number;
};

export default function useMeetingMemo({
  initialValue = '',
  maxLength = 200,
  onSave,
  debounceMs = 500,
}: UseMeetingMemoOptions) {
  const [value, setValue] = useState(initialValue);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const charCount = value.length;

  const handleChange = useCallback(
    (newValue: string) => {
      if (newValue.length > maxLength) {
        return;
      }
      setValue(newValue);
    },
    [maxLength],
  );

  // Debounced auto-save
  useEffect(() => {
    // Skip initial render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSave?.(value);
      setLastSavedAt(new Date());
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, debounceMs, onSave]);

  const formattedSaveTime = lastSavedAt
    ? `${String(lastSavedAt.getHours()).padStart(2, '0')}:${String(lastSavedAt.getMinutes()).padStart(2, '0')} 저장됨`
    : null;

  return {
    value,
    charCount,
    maxLength,
    lastSavedAt,
    formattedSaveTime,
    handleChange,
  };
}
