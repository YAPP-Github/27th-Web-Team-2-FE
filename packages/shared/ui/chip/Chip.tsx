import { ButtonHTMLAttributes } from 'react';

export type ChipVariant = 'line' | 'fill';
export type ChipSize = 'xs' | 'sm' | 'md';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  /**
   * 칩의 선택 가능 여부입니다. false일 경우 선택되지 않은 상태에서도 기본 텍스트 색상이 적용됩니다.
   * @default true
   */
  selectable?: boolean;
}

export default function Chip({
  children,
  text = 'chip',
  variant = 'line',
  size = 'xs',
  selected = false,
  selectable = true,
  className,
  ...props
}: ChipProps) {
  // 기본 스타일
  const baseStyles = `relative flex shrink-0 items-center justify-center whitespace-nowrap border transition-colors ${
    selectable ? 'cursor-pointer' : 'cursor-default'
  }`;

  // 크기별 스타일 (Height, Padding, Typography, Radius)
  const sizeStyles = {
    xs: 'text-caption-7 px-2 py-0.5 rounded-[4px]',
    sm: 'text-body-5 px-2 py-1 rounded-[6px]',
    md: 'text-body-4 px-3 py-1.5 rounded-[6px]',
  };

  // 변형(Variant) 및 선택(Selected) 상태에 따른 색상 스타일
  let colorStyles = '';

  if (variant === 'line') {
    if (selected) {
      colorStyles = 'bg-gray-800 border-gray-800 text-white hover:bg-gray-900';
    } else {
      // 선택되지 않았을 때
      if (selectable) {
        // 선택 가능하면 기본적으로 secondary, hover시 primary
        colorStyles =
          'bg-gray-0 border-line-nonclickable text-text-secondary hover:text-text-primary hover:bg-gray-50';
      } else {
        // 선택 불가능하면 기본적으로 primary (강조됨)
        colorStyles = 'bg-gray-0 border-line-nonclickable text-text-primary';
      }
    }
  } else {
    // Fill
    if (selected) {
      // Hover brightness for 'main color' effect
      colorStyles =
        'bg-primary-default border-transparent text-text-inverse hover:brightness-95';
    } else {
      if (selectable) {
        colorStyles =
          'bg-gray-100 border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-200';
      } else {
        colorStyles =
          'bg-gray-100 border-transparent text-text-primary hover:bg-gray-200';
      }
    }
  }

  return (
    <button
      type='button'
      className={`${baseStyles} ${sizeStyles[size]} ${colorStyles} ${className || ''}`}
      disabled={!selectable && !props.onClick}
      {...props}
    >
      {children || text}
    </button>
  );
}
