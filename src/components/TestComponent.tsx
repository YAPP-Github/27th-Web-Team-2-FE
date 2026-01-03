import type { HTMLAttributes } from 'react';

interface TestComponentProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export default function TestComponent({
  title = 'Tailwind Config Test',
  className,
  ...props
}: TestComponentProps) {
  return (
    <section
      className={`border-line-nonclickable bg-gray-0 flex flex-col gap-6 rounded-3xl border p-8 shadow-sm ${className || ''}`}
      {...props}
    >
      {/* Configuration Header */}
      <div className='flex flex-col gap-2'>
        <h2 className='text-headline-2 text-text-primary'>{title}</h2>
        <p className='text-body-1 text-text-secondary'>
          Global tokens and typography utilities demonstration
        </p>
      </div>

      {/* Typography Showcase */}
      <div className='flex flex-col gap-4 rounded-2xl bg-gray-50 p-6'>
        <h3 className='text-title-3 text-text-primary'>Typography Tokens</h3>
        <div className='flex flex-col gap-2'>
          <span className='text-headline-1 text-primary-default'>
            Headline 1
          </span>
          <span className='text-title-2 text-gray-800'>Title 2 (SemiBold)</span>
          <span className='text-body-1 text-gray-600'>Body 1 (Medium)</span>
          <span className='text-caption-1 text-gray-500'>
            Caption 1 (Regular)
          </span>
        </div>
      </div>

      {/* Color Palette Showcase */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='bg-primary-subtle text-text-inverse flex flex-col gap-2 rounded-2xl p-6'>
          <span className='text-title-4'>Primary Subtle</span>
          <span className='text-body-2'>bg-primary-subtle</span>
        </div>

        <div className='flex flex-col gap-2 rounded-2xl bg-orange-100 p-6'>
          <span className='text-title-4 text-orange-700'>Status Warning</span>
          <span className='text-body-2 text-orange-500'>bg-orange-100</span>
        </div>
      </div>

      {/* Interaction Example */}
      <button
        type='button'
        className='bg-primary-default text-title-5 text-gray-0 hover:bg-blue-70 flex w-full items-center justify-center rounded-xl py-4 transition-all active:scale-[0.98]'
      >
        Click Interaction
      </button>
    </section>
  );
}
