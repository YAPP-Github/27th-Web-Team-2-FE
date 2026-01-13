import { ReactNode } from 'react';

interface TooltipProps {
  /**
   * 툴팁에 표시될 메시지입니다.
   */
  message: string;
  /**
   * 툴팁을 트리거할 요소입니다.
   */
  children?: ReactNode;
  /**
   * 추가적인 스타일 클래스입니다.
   */
  className?: string;
  /**
   * 툴팁의 가시성 여부입니다. true일 경우 항상 보입니다. (Storybook 또는 개발용)
   */
  visible?: boolean;
}

export default function Tooltip({
  message,
  children,
  className = '',
  visible,
}: TooltipProps) {
  return (
    <div
      className={`group relative inline-flex flex-col items-center justify-center ${className}`}
    >
      {children}

      {/* 툴팁 콘텐츠 - 기본적으로 Figma 구조에 따라 아래쪽에 위치 (화살표 다음 본문) */}
      {/* 기본적으로 숨겨져 있으며, 그룹 호버 시 또는 visible=true일 때 표시됨 */}
      <div
        className={`absolute top-full left-1/2 z-50 mt-2 flex -translate-x-1/2 flex-col items-center transition-opacity duration-200 ${visible ? 'visible opacity-100' : 'invisible opacity-0 group-hover:visible group-hover:opacity-100'} drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
      >
        {/* 위쪽 화살표 */}
        <div className='-mb-px h-0 w-0 border-r-[6px] border-b-[6px] border-l-[6px] border-r-transparent border-b-gray-800 border-l-transparent' />

        {/* 본문 */}
        <div className='text-text-inverse min-w-max rounded-full bg-gray-800 px-3 py-1.5'>
          <p className='text-body-5 whitespace-nowrap'>{message}</p>
        </div>
      </div>
    </div>
  );
}
