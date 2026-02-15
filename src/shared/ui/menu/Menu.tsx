'use client';

import { ReactNode, useRef } from 'react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  // position prop은 나중에 필요하다면 확장 가능하며, 현재는 absolute positioning을 기본으로 사용합니다.
  // 완전히 일반적인 컴포넌트로 만들려면 구체적인 위치 지정 로직이 필요할 수 있습니다(예: 라이브러리 또는 유연한 클래스 사용).
  // 지금은 className으로 위치를 재정의할 수 있도록 합니다.
  className?: string;
  children: ReactNode;
}

function MenuMain({ isOpen, onClose, className, children }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 부모 컴포넌트나 백드롭에서 처리하지 않는 경우, 외부 클릭 시 닫기 로직을 여기에 추가할 수 있습니다.
  // 현재 디자인은 단순함을 위해 고정된 백드롭을 사용합니다.

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={menuRef}
        className={`animate-fade-in-down absolute z-50 flex min-w-[160px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg ${
          className || ''
        }`}
      >
        {children}
      </div>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-40 bg-transparent'
        onClick={onClose}
        aria-hidden='true'
      />
    </>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function MenuItem({ children, onClick, className }: MenuItemProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`text-body-2 hover:bg-primary-50 active:bg-primary-100 flex w-full items-center px-4 py-3 text-left text-gray-800 transition-colors ${
        className || ''
      }`}
    >
      {children}
    </button>
  );
}

// Menu를 위한 Divider 스타일 컴포넌트
function MenuDivider() {
  return <div className='h-px w-full bg-gray-100' />;
}

export const Menu = Object.assign(MenuMain, {
  Item: MenuItem,
  Divider: MenuDivider,
});
