import { useEffect, useRef, useState } from 'react';

import Chip from '@/shared/ui/chip/Chip';

import { Icon } from '../icon';

interface DropdownProps {
  participants?: string[];
  onSelectParticipant?: (name: string) => void;
  className?: string;
}

export default function Dropdown({
  participants = [],
  onSelectParticipant,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // (옵션) 바깥 클릭 시 닫기 - 아코디언에도 그대로 써도 됨
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div ref={containerRef} className={`font-pretendard w-full ${className}`}>
      {/* ✅ Gradient Border Wrapper */}
      <div
        className={[
          'rounded-2xl p-px',
          // 보더 그라데이션 (원하는 톤으로 조절)
          'bg-linear-to-b from-blue-200/10 via-blue-200/40 to-blue-200/5',
          // 이미지처럼 은은한 바깥 그림자
          'shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
        ].join(' ')}
      >
        <div
          className={[
            'rounded-2xl',
            'bg-linear-to-b from-(--color-blue-10)/5 via-(--color-gray-0) via-60% to-(--color-gray-0)',
          ].join(' ')}
        >
          {/* Header (Trigger) */}
          <button
            type='button'
            onClick={handleToggle}
            className={[
              'flex w-full items-center justify-between',
              'px-5 py-4',
              // 닫혀있을 땐 높이만, 열렸을 땐 아래 구분선 느낌
              isOpen ? 'border-b border-blue-200/20' : '',
            ].join(' ')}
            aria-expanded={isOpen}
          >
            <div className='flex items-center gap-2'>
              <Icon
                name='ic_people'
                className='text-primary-default'
                size={24}
              />
              <span className='text-body-2 text-primary-default'>
                참여자 보기
              </span>
            </div>

            <div
              className={[
                'h-6 w-6 transition-transform duration-200',
                isOpen ? 'rotate-180' : '',
              ].join(' ')}
            >
              <Icon name='arrow_down' size={24} />
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
              <div className='flex flex-col gap-3 px-5 pt-4 pb-5'>
                {participants.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {participants.map((name) => (
                      <Chip
                        key={name}
                        text={name}
                        variant='line'
                        size='md'
                        onClick={() => onSelectParticipant?.(name)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className='text-body-2 flex h-22 items-center justify-center text-gray-400'>
                    아직 참여자가 없어요
                  </div>
                )}

                {/* Info Footer */}
                <div className='flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-3'>
                  <Icon name='ic_info_outline' size={16} />
                  <span className='text-caption-4 text-text-secondary'>
                    참여자 이름을 클릭하면 필터가 적용돼요!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* (옵션) 닫힌 상태에서도 footer를 보이고 싶으면 이 위치로 빼면 됨 */}
        </div>
      </div>
    </div>
  );
}
