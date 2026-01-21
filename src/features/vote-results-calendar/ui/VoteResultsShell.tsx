import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useRef } from 'react';

import { VoteDateStat } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import Chip from '@/shared/ui/chip';
import { Icon } from '@/shared/ui/icon';

type VoteResultsShellProps = {
  children: React.ReactNode;
  selectedDate: string | null;
  onCloseDetail: () => void;
  selectedStat: VoteDateStat | null;
  calendarRef?: React.RefObject<HTMLDivElement | null>;
};

export function VoteResultsShell({
  children,
  selectedDate,
  onCloseDetail,
  selectedStat,
  calendarRef,
}: VoteResultsShellProps) {
  const detailRef = useRef<HTMLDivElement>(null);

  // Scroll to detail when opened
  useEffect(() => {
    if (selectedDate && detailRef.current) {
      detailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [selectedDate]);

  return (
    <div className='flex flex-col gap-6' ref={calendarRef}>
      {/* 1. Calendar Area */}
      <div className='flex min-h-100 justify-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm'>
        {children}
      </div>

      {/* 2. Detail Section */}
      {selectedDate && (
        <div
          ref={detailRef}
          className='animate-in slide-in-from-top-4 fade-in scroll-mb-24 rounded-xl border border-slate-100 bg-white p-6 shadow-sm duration-300'
        >
          <div className='mb-6 flex items-start justify-between'>
            <div>
              <h3 className='mb-1 text-sm font-medium text-slate-500'>
                {format(parseISO(selectedDate), 'M월 d일 EEEE', { locale: ko })}
              </h3>
              <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold text-slate-900'>
                  {selectedStat ? selectedStat.can.length : 0}명이 가능해요
                </span>
              </div>
            </div>
            <button
              onClick={onCloseDetail}
              className='-mr-2 p-2 text-slate-400 hover:text-slate-600'
            >
              <Icon name='ic_menu_close' size={20} />
            </button>
          </div>

          <div className='space-y-6'>
            {/* Possible */}
            <div>
              <div className='mb-3 flex items-center gap-2 text-sm font-medium text-blue-600'>
                <Icon name='ic_circle_check_filled' size={16} />
                가능한 사람
              </div>
              {selectedStat && selectedStat.can.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {selectedStat.can.map((p) => (
                    <Chip
                      key={p.id}
                      text={p.name}
                      variant='fill'
                      size='md'
                      className='bg-slate-100 text-slate-700'
                    />
                  ))}
                </div>
              ) : (
                <p className='text-sm text-slate-400'>
                  가능한 사람이 없습니다.
                </p>
              )}
            </div>

            <div>
              <div className='mb-3 flex items-center gap-2 text-sm font-medium text-red-500'>
                <Icon name='ic_circle_x_filled' size={16} />
                안되는 사람
              </div>
              {selectedStat && selectedStat.cannot.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {selectedStat.cannot.map((p) => (
                    <Chip
                      key={p.id}
                      text={p.name}
                      variant='fill'
                      size='md'
                      className='bg-slate-100 text-slate-700'
                    />
                  ))}
                </div>
              ) : (
                <p className='text-sm text-slate-400'>
                  불가능한 사람이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
