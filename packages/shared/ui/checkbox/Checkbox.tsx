'use client';

import { InputHTMLAttributes } from 'react';

import Icon from '../icon/Icon';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox({
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <div className='relative h-5 w-5'>
      <input
        type='checkbox'
        className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
        checked={checked}
        onChange={onChange}
        {...props}
      />
      {checked ? (
        <Icon name='ic_checkbox_checked' size={20} className='text-gray-800' />
      ) : (
        <Icon name='ic_checkbox_default' size={20} className='text-gray-200' />
      )}
    </div>
  );
}
