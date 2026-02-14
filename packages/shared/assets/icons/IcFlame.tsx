import type { SVGProps } from 'react';

export default function IcFlame(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 18 18'
      fill='none'
      {...props}
    >
      <path
        d='M9 8.67647C10.3333 6.76118 9 4.14706 8.33333 3.5C8.33333 5.46576 7.15133 6.56771 6.33333 7.38235C5.516 8.19765 5 9.47882 5 10.6176C5 11.6473 5.42143 12.6348 6.17157 13.3629C6.92172 14.091 7.93913 14.5 9 14.5C10.0609 14.5 11.0783 14.091 11.8284 13.3629C12.5786 12.6348 13 11.6473 13 10.6176C13 9.62635 12.296 8.06824 11.6667 7.38235C10.476 9.32353 9.806 9.32353 9 8.67647Z'
        fill='currentColor'
        stroke='currentColor'
        strokeWidth='1.125'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
