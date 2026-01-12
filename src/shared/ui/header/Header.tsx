interface HeaderProps {
  /**
   * 헤더의 변형(Variant)을 결정합니다.
   * - default: 투표 수와 기준 시간이 표시되는 헤더
   * - subHeader: 타이틀만 있는 서브 헤더
   * - thirdTitle: 타이틀과 서브 타이틀이 있는 헤더
   */
  variant?: 'default' | 'subHeader' | 'thirdTitle';

  /**
   * 메인 타이틀 텍스트입니다.
   * Variant가 'default'일 때는 투표 수 텍스트를 대체합니다(옵션).
   */
  title?: string;

  /**
   * 서브 타이틀 텍스트입니다.
   * Variant가 'thirdTitle'일 때 사용됩니다.
   */
  subTitle?: string;

  /**
   * (Default Variant 전용) 투표 참여 인원 수입니다.
   * 이 값이 있으면 title 대신 "X명이 투표했어요" 형태의 텍스트가 렌더링됩니다.
   */
  voteCount?: number;

  /**
   * (Default Variant 전용) 기준 시간 텍스트입니다. 예: "20:13"
   */
  standardTime?: string;

  /**
   * (Default Variant 전용) 새로고침 아이콘 클릭 핸들러입니다.
   */
  onRefresh?: () => void;

  className?: string;
}

export function Header({
  variant = 'default',
  title,
  subTitle,
  voteCount,
  standardTime,
  onRefresh,
  className = '',
}: HeaderProps) {
  return (
    <header className={`flex w-full flex-col ${className}`}>
      {/* Default Variant */}
      {variant === 'default' && (
        <div className='flex w-full items-center justify-between bg-white px-5 pt-6 pb-2'>
          <div className='text-headline-5 text-text-primary'>
            {voteCount !== undefined ? (
              <>
                <span className='text-primary-default'>{voteCount}</span>
                <span>명이 투표했어요</span>
              </>
            ) : (
              title
            )}
          </div>

          {(standardTime || onRefresh) && (
            <button
              onClick={onRefresh}
              className='text-text-tertiary text-caption-6 flex items-center gap-1'
              type='button'
            >
              {/* Refresh Icon Placeholder or SVG */}
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8 1.3335C4.3181 1.3335 1.33333 4.31826 1.33333 8.00016C1.33333 11.6821 4.3181 14.6668 8 14.6668C11.6819 14.6668 14.6667 11.6821 14.6667 8.00016C14.6667 6.46889 14.149 5.06456 13.284 3.96266'
                  stroke='currentColor'
                  strokeWidth='1.2'
                  strokeLinecap='round'
                />
                <path
                  d='M13.3333 1.3335V4.00016H10.6667'
                  stroke='currentColor'
                  strokeWidth='1.2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>{standardTime} 기준</span>
            </button>
          )}
        </div>
      )}

      {/* SubHeader Variant */}
      {variant === 'subHeader' && (
        <div className='flex w-full items-center bg-white px-5 pt-6 pb-2'>
          <h2 className='text-title-4 text-text-primary'>{title}</h2>
        </div>
      )}

      {/* ThirdTitle Variant */}
      {variant === 'thirdTitle' && (
        <div className='flex w-full flex-col gap-1 bg-white px-5 pt-6 pb-2'>
          <h2 className='text-headline-5 text-text-primary'>{title}</h2>
          {subTitle && (
            <p className='text-body-5 text-text-tertiary'>{subTitle}</p>
          )}
        </div>
      )}
    </header>
  );
}
