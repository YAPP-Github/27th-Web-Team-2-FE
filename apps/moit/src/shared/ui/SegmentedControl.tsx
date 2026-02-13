import { cn } from '@/shared/lib/utils';

type SegmentedControlProps<T extends string> = {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex rounded-lg bg-slate-100 p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
            value === option.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
