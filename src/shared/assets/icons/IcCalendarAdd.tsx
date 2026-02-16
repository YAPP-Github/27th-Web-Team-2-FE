import type { HTMLAttributes } from 'react';

export default function IcCalendarAdd(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className='relative h-full w-full'
      data-name='ic_calendar_add'
      {...props}
    >
      <div className='absolute top-[12.5%] right-[8.33%] bottom-[8.33%] left-[16.67%]'>
        <div
          className='absolute inset-[-3.95%_-4.17%]'
          style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
        >
          <svg
            preserveAspectRatio='none'
            width='100%'
            height='100%'
            viewBox='0 0 19.5 20.5'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='block size-full max-w-none'
          >
            <path
              id='Vector'
              d='M9.25 18.75H2.75C2.21957 18.75 1.71086 18.5393 1.33579 18.1642C0.960714 17.7891 0.75 17.2804 0.75 16.75V4.75C0.75 4.21957 0.960714 3.71086 1.33579 3.33579C1.71086 2.96071 2.21957 2.75 2.75 2.75H14.75C15.2804 2.75 15.7891 2.96071 16.1642 3.33579C16.5393 3.71086 16.75 4.21957 16.75 4.75V9.75M12.75 0.75V4.75M4.75 0.75V4.75M0.75 8.75H16.75M12.75 16.75H18.75M15.75 13.75V19.75'
              stroke='var(--stroke-0, #191F28)'
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
