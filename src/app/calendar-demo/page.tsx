'use client';

import dynamic from 'next/dynamic';

const CalendarDemoWidget = dynamic(
  () =>
    import('@/widgets/calendar-demo/ui').then((mod) => mod.CalendarDemoWidget),
  { ssr: false },
);

export default function CalendarDemoPage() {
  return (
    <div className='min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8'>
      <CalendarDemoWidget />
    </div>
  );
}
