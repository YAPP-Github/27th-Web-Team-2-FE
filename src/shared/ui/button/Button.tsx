import { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  /**
   * 버튼에 표시될 텍스트입니다.
   */
  children: React.ReactNode;
  /**
   * true일 경우 버튼의 너비를 100%로 설정합니다.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * 버튼 비활성화 상태입니다.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Figma 디자인 시스템의 CTA Button 컴포넌트입니다.
 * - 높이: 56px
 * - Border radius: 8px
 * - Default: primary-default 배경
 * - Disabled: primary-default 배경 + 30% opacity
 */
const Button = ({
  children,
  fullWidth = false,
  disabled = false,
  className,
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    'button-base',
    fullWidth ? 'button-full-width' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type='button'
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
