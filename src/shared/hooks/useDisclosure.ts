'use client';

import { useCallback, useState } from 'react';

interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * 열림/닫힘 상태를 관리하는 커스텀 훅입니다.
 * 모달, 드로어, 아코디언 등 다양한 UI 컴포넌트의 상태 관리에 사용할 수 있습니다.
 */
export function useDisclosure(initialState = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
