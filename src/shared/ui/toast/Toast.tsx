import { HTMLAttributes, ReactNode } from 'react';

import { Icon } from '../icon';

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: 'default' | 'success' | 'error';
  action?: ReactNode;
}

/**
 * Toast 컴포넌트
 */
export default function Toast({
  message,
  variant = 'default',
  action,
  className = '',
  ...props
}: ToastProps) {
  // 기본 클래스: Pill shape, White background, Shadow
  // Tailwind Utility Class 사용
  const baseClasses =
    'inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-0 pl-[12px] pr-[16px] py-[10px] shadow-[0px_4px_34px_0px_rgba(0,0,0,0.1)]';

  // 텍스트 스타일: text-primary
  // Pretendard 폰트 특성상 영문/숫자 대비 한글이 시각적으로 약간 위로 떠보일 수 있어 pt-[2px]로 보정 -> Figma 중앙 정렬 기준 제거 test
  const textClass = 'text-text-primary text-title-8';

  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <div className={combinedClasses} role='alert' {...props}>
      {/* 아이콘: Success/Default는 Blue Check, Error는 Red X */}
      <div className='flex items-center'>
        {variant === 'error' ? (
          <Icon
            name='ic_circle_x_filled'
            size={20}
            className='text-status-error'
          />
        ) : (
          <Icon
            name='ic_circle_check_filled'
            size={20}
            className='text-primary-default'
          />
        )}
      </div>

      {/* 메시지 */}
      <div className={textClass}>{message}</div>

      {/* 액션 버튼 (선택 사항) */}
      {action && <div className='shrink-0'>{action}</div>}
    </div>
  );
}
