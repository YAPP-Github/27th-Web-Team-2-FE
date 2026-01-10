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
    'relative flex items-center justify-center rounded-[4px] border transition-colors cursor-pointer shrink-0 whitespace-nowrap';

  // 크기별 스타일 (Height, Padding, Typography)
  // Figma Spec 유추:
  // xs: Caption/7 (11px), Height가 작음
  // sm: Body/5 (12px)
  // md: Body/4 (14px)
  const sizeStyles = {
    xs: 'h-[24px] px-[8px] text-caption-7',
    sm: 'h-[28px] px-[10px] text-body-5',
    md: 'h-[32px] px-[12px] text-body-4',
  };

  // 변형(Variant) 및 선택(Selected) 상태에 따른 색상 스타일
  let colorStyles = '';

  if (variant === 'line') {
    if (selected) {
      // Line + Selected
      // Border: Primary, BG: Blue-10, Text: Primary
      colorStyles =
        'border-primary-default bg-blue-10 text-primary-default hover:bg-blue-30';
    } else {
      // Line + Not Selected
      // Border: Line/NonClickable, BG: White, Text: Text/Secondary
      // Hover시 BG: Gray-50 (유추)
      colorStyles =
        'border-line-nonclickable bg-gray-0 text-text-secondary hover:bg-gray-50 hover:text-text-primary';
    }
  } else {
    // Fill
    if (selected) {
      // Fill + Selected
      // Border: Transparent, BG: Primary, Text: Inverse
      colorStyles =
        'border-transparent bg-primary-default text-text-inverse hover:bg-[#2558d0]'; // Hover color rough estimate or just reliance on global hover if available
    } else {
      // Fill + Not Selected
      // Border: Transparent, BG: Gray-100, Text: Text/Secondary
      colorStyles =
        'border-transparent bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-text-primary';
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
