'use client';
import { useRef, useState } from 'react';

import { trackEvent } from '@/shared/lib/amplitude';
import Chip from '@/shared/ui/chip/Chip';

import Icon from '../icon/Icon';

interface DropdownProps {
  participants?: string[];
  selectedParticipant?: string | null;
  onSelectParticipant?: (name: string) => void;
  className?: string;
}

export default function Dropdown({
  participants = [],
  selectedParticipant,
  onSelectParticipant,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // (옵션) 바깥 클릭 시 닫기 - 아코디언에도 그대로 써도 됨
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       containerRef.current &&
  //       !containerRef.current.contains(event.target as Node)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  const handleToggle = () => {
    trackEvent('voter_dropdown_click');
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={`font-pretendard w-full ${className}`}>
      <div
        style={{
          borderRadius: '8px',
          border: '1px solid var(--primary-subtler, rgba(60, 126, 250, 0.30))',
          background:
            'linear-gradient(0deg, rgba(255, 255, 255, 0.00) 7.66%, rgba(46, 107, 250, 0.09) 93.19%), var(--Primitive-Gray-scale-0, #FFF)',
          boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header (Trigger) */}
        <button
          type='button'
          onClick={handleToggle}
          className={[
            'flex w-full items-center justify-between',
            'px-5 py-4',
            // 닫혀있을 땐 높이만, 열렸을 땐 아래 구분선 느낌
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

        {/* (옵션) 닫힌 상태에서도 footer를 보이고 싶으면 이 위치로 빼면 됨 */}
      </div>
    </div>
  );
}
