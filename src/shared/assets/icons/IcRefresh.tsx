import type { HTMLAttributes } from 'react';

export default function IcRefresh(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='relative h-full w-full' data-name='ic_refresh' {...props}>
      <div className='absolute inset-[16.66%_16.67%]'>
        <div
          className='absolute inset-[-4.69%]'
          style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}
        >
          <svg
            preserveAspectRatio='none'
            width='100%'
            height='100%'
            viewBox='0 0 17.5 17.5'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='block size-full max-w-none'
          >
            <path
              id='Vector'
              d='M16.6821 9.79358C16.4933 11.2335 15.916 12.5949 15.0123 13.7317C14.1085 14.8686 12.9123 15.7379 11.552 16.2466C10.1918 16.7553 8.71866 16.8841 7.29074 16.6192C5.86282 16.3542 4.53395 15.7056 3.44664 14.7429C2.35933 13.7801 1.5546 12.5396 1.11876 11.1542C0.682916 9.76889 0.632404 8.29103 0.972639 6.87917C1.31287 5.4673 2.03102 4.17468 3.05006 3.13994C4.0691 2.10519 5.35059 1.36737 6.75709 1.00558C10.6561 0.00558025 14.6921 2.01258 16.1821 5.75258M16.7491 0.752566V5.75257H11.7491'
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
