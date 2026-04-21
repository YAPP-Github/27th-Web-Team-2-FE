'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { KeyboardEvent } from 'react';

import { cn } from '@/shared/lib/utils';

const toggleTrackVariants = cva(
  'relative inline-flex h-[28px] w-[48px] items-center rounded-full transition-colors duration-200 ease-in-out',
  {
    variants: {
      state: {
        on: 'bg-primary-default',
        off: 'bg-gray-200',
      },
    },
    defaultVariants: {
      state: 'off',
    },
  },
);

const toggleThumbVariants = cva(
  'pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
  {
    variants: {
      state: {
        on: 'translate-x-[22px]',
        off: 'translate-x-[2px]',
      },
    },
    defaultVariants: {
      state: 'off',
    },
  },
);

interface ToggleProps extends VariantProps<typeof toggleTrackVariants> {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  id,
  ariaLabel,
  className,
}: ToggleProps) {
  const state = checked ? 'on' : 'off';

  function handleClick() {
    if (disabled) return;
    onChange(!checked);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onChange(!checked);
    }
  }

  return (
    <button
      type='button'
      role='switch'
      id={id}
      aria-label={ariaLabel}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex h-11 min-w-12 items-center justify-center rounded-full p-0',
        'focus-visible:ring-primary-default focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'cursor-pointer',
        className,
      )}
    >
      <span className={cn(toggleTrackVariants({ state }))} aria-hidden='true'>
        <span className={cn(toggleThumbVariants({ state }))} />
      </span>
    </button>
  );
}
