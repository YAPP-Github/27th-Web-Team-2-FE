import type { HTMLAttributes } from 'react';

export default function IcHamburger(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='relative h-full w-full' data-name='ic_hamburger' {...props}>
      <div className='absolute top-1/4 right-[16.67%] bottom-1/4 left-[16.67%]'>
        <div
          className='absolute inset-[-6.25%_-4.69%]'
          style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
        >
          <svg
            preserveAspectRatio='none'
            width='100%'
            height='100%'
            viewBox='0 0 17.5 13.5'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='block size-full max-w-none'
          >
            <path
              id='Vector'
              d='M0.75 0.75H16.75M0.75 6.75H16.75M0.75 12.75H16.75'
              stroke='var(--stroke-0, #4E5968)'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
