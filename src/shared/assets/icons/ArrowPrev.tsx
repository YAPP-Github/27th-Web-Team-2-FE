import type { HTMLAttributes } from 'react';

export default function ArrowPrev(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='relative h-full w-full' data-name='arrow_prev' {...props}>
      <div className='absolute top-1/4 right-[33.42%] bottom-1/4 left-[41.58%] flex items-center justify-center'>
        <div className='h-[10px] w-[5px] flex-none'>
          <div className='relative size-full'>
            <div
              className='absolute inset-[-7.5%_-15%]'
              style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
            >
              <svg
                preserveAspectRatio='none'
                width='100%'
                height='100%'
                viewBox='0 0 6.5 11.5'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='block size-full max-w-none'
              >
                <path
                  id='Vector 9'
                  d='M5.75 0.75L0.75 5.75L5.75 10.75'
                  stroke='var(--stroke-0, #333D4B)'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
