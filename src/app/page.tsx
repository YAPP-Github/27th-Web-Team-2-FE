import Link from 'next/link';

import Button from '@/shared/ui/button/Button';

export default function OnboardingPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-between px-5 py-10'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='text-center'>
          {/* TODO: 실제 로고 이미지로 교체 필요 */}
          <div className='mb-8 flex justify-center'>
            <div className='bg-primary-default flex h-24 w-24 items-center justify-center rounded-full'>
              <span className='text-headline-2 text-text-inverse'>LOGO</span>
            </div>
          </div>

          <h1 className='text-headline-2 text-text-primary mb-4'>
            온보딩 페이지
          </h1>
        </div>
      </div>

      <Link href='/create' className='w-full'>
        <Button fullWidth>시작하기</Button>
      </Link>
    </div>
  );
}
