import type { HTMLAttributes } from 'react';

export default function IcInfoFilled(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className='relative h-full w-full'
      data-name='ic_info_filled'
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
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM10 15C10.5523 15 11 14.5523 11 14V9C11 8.44772 10.5523 8 10 8C9.44772 8 9 8.44772 9 9V14C9 14.5523 9.44772 15 10 15ZM11 6C11 6.55228 10.5523 7 10 7C9.44772 7 9 6.55228 9 6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6Z'
            fill='currentColor'
          />
        </svg>
      </div>
    </div>
  );
}
