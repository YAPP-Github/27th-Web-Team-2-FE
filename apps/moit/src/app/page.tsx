import Button from '@repo/shared/ui/button/Button';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div
      className='flex min-h-screen flex-col bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: "url('/host_main_onboarding.png')" }}
    >
      <div className='flex-1' />

      <p className='text-text-secondary text-body-4 text-center'>
        시작하기를 눌러 투표를 만들어보세요!
      </p>

      <div className='p-5'>
        <Link href='/create' className='w-full'>
          <Button fullWidth>시작하기</Button>
        </Link>
      </div>
    </div>
  );
}
