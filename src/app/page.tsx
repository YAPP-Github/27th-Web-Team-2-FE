import Link from 'next/link';

import Button from '@/shared/ui/button/Button';

export default function OnboardingPage() {
  return (
    <div
      className='flex min-h-screen flex-col bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: "url('/host_main_onboarding.png')" }}
    >
      <div className='flex-1' />

      <div className='p-5'>
        <Link href='/create' className='w-full'>
          <Button fullWidth>시작하기</Button>
        </Link>
      </div>
    </div>
  );
}
