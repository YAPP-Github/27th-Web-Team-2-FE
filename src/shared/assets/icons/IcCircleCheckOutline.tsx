import type { HTMLAttributes } from 'react';

export default function IcCircleCheckOutline(
  props: HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      className='relative h-full w-full'
      data-name='ic_circle_check_outline'
      {...props}
    >
      <div className='absolute inset-[8.33%]'>
        <svg
          preserveAspectRatio='none'
          width='100%'
          height='100%'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='block size-full max-w-none'
        >
          <g id='Group 1'>
            <path
              id='Vector 11'
              d='M6.64722 10L8.88241 12.5146L13.1987 8.19459'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              id='Vector'
              d='M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433286 8.00043 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34871 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM10 18.3333C8.35183 18.3333 6.74066 17.8446 5.37025 16.9289C3.99984 16.0132 2.93174 14.7117 2.30101 13.189C1.67028 11.6663 1.50525 9.99075 1.82679 8.37425C2.14834 6.75774 2.94201 5.27288 4.10745 4.10744C5.27288 2.94201 6.75774 2.14833 8.37425 1.82679C9.99076 1.50525 11.6663 1.67027 13.189 2.301C14.7117 2.93173 16.0132 3.99984 16.9289 5.37025C17.8446 6.74066 18.3333 8.35182 18.3333 10C18.3309 12.2094 17.4522 14.3276 15.8899 15.8899C14.3276 17.4522 12.2094 18.3309 10 18.3333V18.3333Z'
              fill='currentColor'
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
