import type { HTMLAttributes } from 'react';

const IcMenuClose = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className='relative h-full w-full'
      data-name='ic_menu_close'
      {...props}
    >
      <div className='absolute inset-[30%]'>
        <div
          className='absolute inset-[-9.38%]'
          style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
        >
          <svg
            preserveAspectRatio='none'
            width='100%'
            height='100%'
            viewBox='0 0 9.5 9.5'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='block size-full max-w-none'
          >
            <path
              id='Vector'
              d='M8.74996 8.74996L4.75 4.75M4.75 4.75L0.75 0.75M4.75 4.75L8.75 0.75M4.75 4.75L0.75 8.75'
              stroke='var(--stroke-0, #333D4B)'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default IcMenuClose;
