import type { HTMLAttributes } from 'react';

export default function IcCheck(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='relative h-full w-full' data-name='ic_check' {...props}>
      <div className='absolute inset-[29.17%_16.67%_29.17%_20.83%]'>
        <svg
          preserveAspectRatio='none'
          width='100%'
          height='100%'
          viewBox='0 0 16.5 11.5'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='block size-full max-w-none'
        >
          <path
            d='M0.75 5.75L5.75 10.75L15.75 0.75'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    </div>
  );
}
