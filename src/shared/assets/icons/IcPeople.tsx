import type { HTMLAttributes } from 'react';

export default function IcPeople(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='relative h-full w-full' data-name='ic_people' {...props}>
      <div className='absolute inset-[16.67%_16.67%_20.83%_20.83%]'>
        <div
          className='absolute inset-[-5%]'
          style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
        >
          <svg
            preserveAspectRatio='none'
            width='100%'
            height='100%'
            viewBox='0 0 16.5 16.5'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='block size-full max-w-none'
          >
            <path
              id='Vector'
              d='M0.75 15.75V14.0833C0.75 13.1993 1.10119 12.3514 1.72631 11.7263C2.35143 11.1012 3.19928 10.75 4.08333 10.75H7.41667C8.30072 10.75 9.14857 11.1012 9.77369 11.7263C10.3988 12.3514 10.75 13.1993 10.75 14.0833V15.75M11.5833 0.858337C12.3003 1.04192 12.9359 1.45892 13.3897 2.0436C13.8435 2.62827 14.0899 3.34736 14.0899 4.82765C14.0899 4.82765 13.8435 5.54674 13.3897 6.13141C12.9359 6.71609 12.3003 7.13309 11.5833 7.31667M15.75 15.75V14.0834C15.7458 13.3477 15.4983 12.634 15.0461 12.0537C14.5939 11.4734 13.9624 11.0589 13.25 10.875M2.41667 4.08333C2.41667 4.96739 2.76786 5.81524 3.39298 6.44036C4.0181 7.06548 4.86594 7.41667 5.75 7.41667C6.63405 7.41667 7.4819 7.06548 8.10702 6.44036C8.73214 5.81524 9.08333 4.96739 9.08333 4.08333C9.08333 3.19928 8.73214 2.35143 8.10702 1.72631C7.4819 1.10119 6.63405 0.75 5.75 0.75C4.86594 0.75 4.0181 1.10119 3.39298 1.72631C2.76786 2.35143 2.41667 3.19928 2.41667 4.08333Z'
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
