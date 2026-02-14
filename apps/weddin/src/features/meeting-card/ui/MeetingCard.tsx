import Chip from '@repo/shared/ui/chip/Chip';
import Icon from '@repo/shared/ui/icon/Icon';

import { cn } from '@/shared/lib/utils';

import type { MeetingCardProps } from '../model/types';

export default function MeetingCard({ meeting, className }: MeetingCardProps) {
  const { title, dDay, currentVotes, totalVotes, topDate } = meeting;
  const progressPercent =
    totalVotes > 0 ? (currentVotes / totalVotes) * 100 : 0;

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 rounded-[12px] bg-white p-3 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      {/* Top section: D-day chip + title + arrow */}
      <div className='flex flex-col gap-3'>
        <div className='flex w-full items-start justify-between'>
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {/* D-day chip - Override colors to match Figma (gray-700) */}
            <Chip
              variant='line'
              size='sm'
              selected
              selectable={false}
              text={`D-${dDay}`}
              className='border-gray-700! bg-gray-700! text-white!'
            />

            {/* Meeting title */}
            <p className='text-title-7 min-w-0 flex-1 text-gray-900'>{title}</p>
          </div>

          {/* Arrow icon */}
          <Icon
            name='arrow_next'
            size={20}
            className='shrink-0 text-gray-400'
          />
        </div>

        {/* Progress bar + vote count */}
        <div className='flex w-full items-center justify-between gap-2'>
          {/* Progress bar */}
          <div className='h-3 flex-1 overflow-hidden rounded-[9px] bg-gray-100'>
            <div
              className='h-full rounded-[9px] bg-linear-to-r from-red-300 to-[#ff8094]'
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Vote count */}
          <p className='text-body-5 text-text-tertiary shrink-0'>
            <span className='text-primary-subtle'>{currentVotes}</span>
            <span>/{totalVotes}</span>
          </p>
        </div>
      </div>

      {/* Bottom section: Top date info */}
      <div className='flex items-center gap-1.5 rounded-lg bg-gray-50 p-2'>
        <div className='flex items-center'>
          <Icon name='ic_flame' size={18} className='text-gray-300' />
          <span className='text-body-5 text-text-tertiary'>유력 날짜</span>
        </div>
        <span className='text-body-5 text-gray-200'>|</span>
        <span className='text-body-5 text-text-primary font-semibold'>
          {topDate}
        </span>
      </div>
    </div>
  );
}
