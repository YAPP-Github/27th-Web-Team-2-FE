import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { VoteDateStat } from '@/entities/voteDateStat/model';

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
      calendarRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [selectedDate, calendarRef]);

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
          className='animate-in slide-in-from-top-4 fade-in rounded-xl border border-slate-100 bg-white p-6 shadow-sm duration-300'
        >
          <div className='mb-6 flex items-start justify-between'>
            <div>
              <h3 className='mb-1 text-sm font-medium text-slate-500'>
                {format(parseISO(selectedDate), 'M月 d日 EEEE', { locale: ko })}
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
              <X className='h-5 w-5' />
            </button>
          </div>

          <div className='space-y-6'>
            {/* Possible */}
            <div>
              <div className='mb-3 flex items-center gap-2 text-sm font-medium text-blue-600'>
                <Check className='h-4 w-4' />
                가능한 사람
              </div>
              {selectedStat && selectedStat.can.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {selectedStat.can.map((p) => (
                    <span
                      key={p.id}
                      className='rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700'
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-slate-400'>
                  가능한 사람이 없습니다.
                </p>
              )}
            </div>

            {/* Impossible */}
            <div>
              <div className='mb-3 flex items-center gap-2 text-sm font-medium text-red-500'>
                <X className='h-4 w-4' />
                안되는 사람
              </div>
              {selectedStat && selectedStat.cannot.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {selectedStat.cannot.map((p) => (
                    <span
                      key={p.id}
                      className='rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-400'
                    >
                      {p.name}
                    </span>
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
