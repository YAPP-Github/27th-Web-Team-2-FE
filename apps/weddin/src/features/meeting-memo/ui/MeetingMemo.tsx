'use client';

import Icon from '@repo/shared/ui/icon/Icon';

import { cn } from '@/shared/lib/utils';

import useMeetingMemo from '../model/useMeetingMemo';

type MeetingMemoProps = {
  initialValue?: string;
  onSave?: (value: string) => void;
  maxLength?: number;
  className?: string;
};

export default function MeetingMemo({
  initialValue = '',
  onSave,
  maxLength = 200,
  className,
}: MeetingMemoProps) {
  const { value, charCount, formattedSaveTime, handleChange } = useMeetingMemo({
    initialValue,
    maxLength,
    onSave,
  });

  return (
    <div
      className={cn(
        'flex w-full items-center rounded-xl bg-white p-5 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      <div className='flex flex-1 flex-col gap-2'>
        {/* Title */}
        <div className='flex flex-col items-start'>
          <p className='text-title-6 text-text-primary'>메모</p>
        </div>

        {/* Textarea + Footer */}
        <div className='flex w-full flex-col gap-1'>
          {/* Textarea */}
          <div className='flex h-30.25 w-full items-start justify-between rounded-lg border border-gray-100 bg-white px-3.5 py-3'>
            <textarea
              className='text-body-4 text-text-primary placeholder:text-text-quaternary h-full w-full resize-none bg-transparent outline-none'
              placeholder='모임에서 만나는 장소, 음식 등을 메모해보세요.'
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              maxLength={maxLength}
            />
          </div>

          {/* Footer: Save indicator + Char counter */}
          <div className='flex w-full items-center justify-between'>
            {/* Save indicator */}
            <div className='flex items-center gap-0.5'>
              {formattedSaveTime ? (
                <>
                  <Icon
                    name='ic_check'
                    size={16}
                    className='text-text-tertiary'
                  />

                  <p className='text-body-5 text-text-tertiary'>
                    {formattedSaveTime}
                  </p>
                </>
              ) : null}
            </div>

            {/* Character counter */}
            <p className='text-body-5 text-text-quaternary'>
              {charCount}/{maxLength}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
