import { HTMLAttributes } from 'react';

import { IconName } from '@/shared/assets/icons/iconRegistry';
import Icon from '@/shared/ui/icon/Icon';

interface TopBarProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  leftIcon?: IconName;
  onLeftClick?: () => void;
  rightIcon?: IconName;
  onRightClick?: () => void;
  className?: string;
  /**
   * 좌우 아이콘의 색상을 지정합니다.
   * 현재는 일관된 스타일 유지를 위해 동일한 색상을 적용하지만, 추후 확장이 필요하면 개별 로직으로 분리할 수 있습니다.
   */
  iconColor?: string;
}

export default function TopBar({
  title,
  leftIcon,
  onLeftClick,
  rightIcon,
  onRightClick,
  className,
  iconColor,
  ...props
}: TopBarProps) {
  return (
    <header
      className={`bg-gray-0 relative flex h-14 w-full shrink-0 items-center justify-between px-1 ${
        className || ''
      }`}
      {...props}
    >
      {/* 좌측 아이콘 영역 - 터치 타겟 확보를 위해 고정 크기 사용 */}
      <div className='flex h-12 w-12 items-center justify-center'>
        {leftIcon && (
          <button
            type='button'
            onClick={onLeftClick}
            className='flex h-full w-full items-center justify-center rounded-full p-2 active:bg-gray-100'
            aria-label='Left Action'
          >
            <Icon name={leftIcon} size={24} color={iconColor} />
          </button>
        )}
      </div>

      {/* 제목 영역 - 완벽한 중앙 정렬을 위해 absolute 포지셔닝 사용 */}
      <h1 className='text-title-7 absolute top-1/2 left-1/2 max-w-[calc(100%-120px)] -translate-x-1/2 -translate-y-1/2 truncate text-center text-gray-900'>
        {title}
      </h1>

      {/* 우측 아이콘 영역 - 터치 타겟 확보를 위해 고정 크기 사용 */}
      <div className='flex h-12 w-12 items-center justify-center'>
        {rightIcon && (
          <button
            type='button'
            onClick={onRightClick}
            className='flex h-full w-full items-center justify-center rounded-full p-2 active:bg-gray-100'
            aria-label='Right Action'
          >
            <Icon name={rightIcon} size={24} color={iconColor} />
          </button>
        )}
      </div>
    </header>
  );
}
