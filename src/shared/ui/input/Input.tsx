import { ComponentProps, KeyboardEvent, useId, useState } from 'react';

import Icon from '../icon/Icon';

interface InputProps extends ComponentProps<'input'> {
  /**
   * 입력 필드의 라벨 텍스트입니다.
   */
  label?: string;
  /**
   * 에러 메시지입니다. 존재할 경우 테두리 색상이 변경됩니다.
   */
  errorMessage?: string;
  /**
   * 도움말 텍스트입니다. 에러 메시지가 없을 때 표시됩니다.
   */
  helperText?: string;
  /**
   * true일 경우 input의 너비를 100%로 설정합니다.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * X 버튼을 클릭했을 때 호출되는 함수입니다.
   * 제공하지 않으면 내부적으로 값을 비우고 포커스를 설정합니다.
   */
  onClear?: () => void;
  /**
   * SSR/CSR 불일치 경고를 무시합니다. (랜덤 placeholder 등)
   * https://react.dev/reference/react-dom/components/common #suppressHydrationWarning
   */
  suppressHydrationWarning?: boolean;
}

/**
 * Figma 디자인 시스템의 Input 컴포넌트입니다.
 * - Clear(X) 버튼 지원
 * - 글자수 카운팅 지원 (maxLength 설정 시)
 */
export default function Input({
  className,
  label,
  errorMessage,
  helperText,
  fullWidth,
  id,
  ref,
  maxLength,
  value,
  defaultValue,
  onClear,
  onChange,
  onKeyDown,
  suppressHydrationWarning,
  ...props
}: InputProps) {
  // 접근성 ID 자동 생성
  const generatedId = useId();
  const inputId = id || generatedId;
  const isError = !!errorMessage;

  // 현재 글자수 상태
  const [charCount, setCharCount] = useState(() => {
    if (value !== undefined) return String(value).length;
    if (defaultValue !== undefined) return String(defaultValue).length;
    return 0;
  });

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. MaxLength 강제 제한 (한글 등 IME 입력 시 native maxLength가 뚫리는 문제 해결)
    if (maxLength && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }

    setCharCount(e.target.value.length);
    onChange?.(e);
  };

  // 클리어 버튼 핸들러
  const handleClear = () => {
    onClear?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
    onKeyDown?.(e);
  };

  // value가 controlled로 넘어오면 해당 길이 사용, 아니면 내부 상태 사용
  const currentCount = value !== undefined ? String(value).length : charCount;
  const hasValue = currentCount > 0;
  // 글자수 표시 여부: maxLength가 있고, (값이 있거나 포커스되어 있거나... 기획에 따라 다르지만 보통 항상 표시 or 입력시 표시)
  // 이미지상으로는 항상 표시되는 것으로 보임 (0/10)
  const showCount = maxLength !== undefined && maxLength > 0;

  // 스타일 클래스 조합
  const containerClasses = [
    'input-container',
    fullWidth ? 'input-full-width' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    'input-field',
    'text-body-2',
    fullWidth ? 'input-full-width' : '',
    isError ? 'input-error' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  // 우측 아이콘 공간 확보 (padding-right)
  // X버튼만 내부에 존재 (약 40px)
  const rightPadding =
    hasValue && !props.disabled && !props.readOnly ? '40px' : '16px';

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className='input-label text-title-8'>
          {label}
        </label>
      )}

      <div className='input-wrapper'>
        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          value={value}
          defaultValue={defaultValue}
          // Native maxLength는 IME 입력 중에는 동작이 이상할 수 있으나,
          // 기본적인 제한을 위해 남겨두되 onChange에서 강제로 자름
          maxLength={maxLength}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ paddingRight: rightPadding }}
          suppressHydrationWarning={suppressHydrationWarning}
          {...props}
        />

        {/* X Button (Only inside input) */}
        {hasValue && !props.disabled && !props.readOnly && (
          <div className='input-right-element'>
            <div
              className='input-clear-button'
              onClick={handleClear}
              role='button'
              tabIndex={-1}
              aria-label='지우기'
            >
              <Icon name='ic_circle_x_filled' size={20} />
            </div>
          </div>
        )}
      </div>

      <div className='input-bottom-area'>
        <div className='input-message'>
          {errorMessage ? (
            <span className='input-error-text text-body-5'>{errorMessage}</span>
          ) : helperText ? (
            <span className='input-helper-text text-caption-7'>
              {helperText}
            </span>
          ) : null}
        </div>

        {showCount && (
          <span className='input-count text-caption-5'>
            {currentCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
