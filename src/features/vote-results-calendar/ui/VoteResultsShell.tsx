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
    <div className='flex flex-col gap-2' ref={calendarRef}>
      {/* 1. Calendar Area */}
      <div className='flex min-h-100 justify-center rounded-lg border border-slate-100 bg-white p-4 shadow-[0_0_30px_0_rgba(0,0,0,0.04)]'>
        {children}
      </div>

      {/* 2. Detail Section */}
      {selectedDate && (
        <div
          ref={detailRef}
          className='animate-in slide-in-from-top-4 fade-in relative flex scroll-mb-24 flex-col gap-6 rounded-lg bg-white p-5 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)] duration-300'
        >
          {/* Header */}
          <div className='flex items-start justify-between'>
            <div className='flex flex-col gap-1.5'>
              <h3 className='text-caption-7 text-gray-600'>
                {format(parseISO(selectedDate), 'M월 d일 EEEE', { locale: ko })}
              </h3>
              <span className='text-title-6 text-gray-900'>
                <span className='text-primary-default'>
                  {selectedStat ? selectedStat.can.length : 0}
                </span>
                명이 가능해요
              </span>
            </div>
            <button
              onClick={onCloseDetail}
              className='text-gray-400 hover:text-gray-600'
            >
              <Icon name='ic_menu_close' size={24} />
            </button>
          </div>

          <div className='flex flex-col gap-6'>
            {/* Possible */}
            <div className='flex flex-col gap-3'>
              <div className='text-body-5 text-primary-default flex items-center gap-0.5'>
                <Icon name='ic_circle_check_filled' size={16} />
                가능한 사람 ({selectedStat ? selectedStat.can.length : 0})
              </div>
              {selectedStat && selectedStat.can.length > 0 ? (
                <div className='flex flex-wrap gap-1.5'>
                  {selectedStat.can.map((p) => (
                    <Chip
                      key={p.id}
                      text={p.name}
                      variant='fill'
                      size='sm'
                      selectable={false}
                    />
                  ))}
                </div>
              ) : (
                <p className='text-body-5 text-text-tertiary text-center'>
                  가능한 사람이 없습니다.
                </p>
              )}
            </div>

            {/* Impossible */}
            <div className='flex flex-col gap-3'>
              <div className='text-body-5 flex items-center gap-0.5 text-orange-700'>
                <Icon name='ic_circle_x_filled' size={16} />
                안되는 사람 ({selectedStat ? selectedStat.cannot.length : 0})
              </div>
              {selectedStat && selectedStat.cannot.length > 0 ? (
                <div className='flex flex-wrap gap-1.5'>
                  {selectedStat.cannot.map((p) => (
                    <Chip
                      key={p.id}
                      text={p.name}
                      variant='fill'
                      size='sm'
                      selectable={false}
                    />
                  ))}
                </div>
              ) : (
                <p className='text-body-5 text-text-tertiary text-center'>
                  안되는 사람이 없어요
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
