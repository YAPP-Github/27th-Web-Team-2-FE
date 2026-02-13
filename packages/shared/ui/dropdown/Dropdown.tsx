'use client';
import Icon from '@repo/shared/ui/icon/Icon';
import { useRef, useState } from 'react';

import Chip from '../chip/Chip';

interface DropdownProps {
  participants?: string[];
  selectedParticipant?: string | null;
  onSelectParticipant?: (name: string) => void;
  onToggle?: () => void;
  className?: string;
}

export default function Dropdown({
  participants = [],
  selectedParticipant,
  onSelectParticipant,
  onToggle,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    onToggle?.();
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={`font-pretendard w-full ${className}`}>
      <div className='border-primary-subtler rounded-[--radius-dropdown] border bg-[linear-gradient(0deg,rgba(255,255,255,0)_7.66%,var(--color-primary-subtlest)_93.19%),var(--color-gray-0)] shadow-[0_0_30px_0_rgba(0,0,0,0.04)]'>
        {/* Header (Trigger) */}
        <button
          type='button'
          onClick={handleToggle}
          className={[
            'flex w-full items-center justify-between',
            'px-5 py-4',
          ].join(' ')}
          aria-expanded={isOpen}
        >
          <div className='flex items-center gap-2'>
            <Icon name='ic_people' className='text-primary-default' size={24} />
            <span className='text-body-4 text-primary-default'>
              참여자 보기
            </span>
          </div>

          <div
            className={[
              'h-6 w-6 transition-transform duration-200',
              isOpen ? '' : 'rotate-180',
            ].join(' ')}
          >
            <Icon
              name='arrow_down'
              className='text-primary-default'
              size={24}
            />
          </div>
        </button>

        {/* Content (Accordion Area) */}
        <div
          className={[
            'grid transition-[grid-template-rows] duration-200 ease-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          ].join(' ')}
        >
          <div className='overflow-hidden'>
            <div className='flex flex-col gap-3 px-4 pb-4'>
              {participants.length > 0 ? (
                <div className='flex max-h-41 flex-wrap gap-2 overflow-y-auto'>
                  {participants.map((name) => (
                    <Chip
                      key={name}
                      text={name}
                      variant='line'
                      size='md'
                      className='max-w-full truncate'
                      selected={selectedParticipant === name}
                      onClick={() => onSelectParticipant?.(name)}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-body-5 flex h-22 items-center justify-center text-gray-400'>
                  아직 참여자가 없어요
                </div>
              )}

              {/* Info Footer */}
              <div className='flex items-center gap-1.5 rounded-sm bg-gray-100 p-2.5'>
                <Icon name='ic_info_outline' size={16} />
                <span className='text-body-5 text-text-primary'>
                  참여자 이름을 클릭하면 그 사람이 선택한 날짜만 볼 수 있어요!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
