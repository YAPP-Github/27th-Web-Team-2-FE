import { ButtonHTMLAttributes } from 'react';

export type ChipVariant = 'line' | 'fill';
export type ChipSize = 'xs' | 'sm' | 'md';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 칩 내부에 들어갈 텍스트입니다. children이 있으면 children이 우선됩니다.
   */
  text?: string;
  /**
   * 칩의 스타일 변형입니다. 'line' 또는 'fill'을 선택할 수 있습니다.
   * @default 'line'
   */
  variant?: ChipVariant;
  /**
   * 칩의 크기입니다. 'xs', 'sm', 'md' 중 선택할 수 있습니다.
   * @default 'xs'
   */
  size?: ChipSize;
  /**
   * 칩의 선택 여부입니다. true일 경우 선택된 스타일이 적용됩니다.
   * @default false
   */
  selected?: boolean;
}

export default function Chip({
  children,
  text = 'chip',
  variant = 'line',
  size = 'xs',
  selected = false,
  className,
  ...props
}: ChipProps) {
  // 기본 스타일
  const baseStyles =
    'relative flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded border transition-colors';

  // 크기별 스타일 (Height, Padding, Typography)
  const sizeStyles = {
    xs: 'text-caption-7 h-6 px-2',
    sm: 'text-body-5 h-7 px-2.5',
    md: 'text-body-4 h-8 px-3',
  };

  // 변형(Variant) 및 선택(Selected) 상태에 따른 색상 스타일
  let colorStyles = '';

  if (variant === 'line') {
    if (selected) {
      colorStyles = 'bg-gray-800 border-gray-800 text-white hover:bg-gray-900';
    } else {
      colorStyles =
        'bg-gray-0 border-line-nonclickable text-text-secondary hover:text-text-primary hover:bg-gray-50';
    }
  } else {
    // Fill
    if (selected) {
      // Hover brightness for 'main color' effect
      colorStyles =
        'bg-primary-default border-transparent text-text-inverse hover:brightness-95';
    } else {
      colorStyles =
        'bg-gray-100 border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-200';
    }
  }

  return (
    <button
      type='button'
      className={`${baseStyles} ${sizeStyles[size]} ${colorStyles} ${className || ''}`}
      {...props}
    >
      {children || text}
    </button>
  );
}
