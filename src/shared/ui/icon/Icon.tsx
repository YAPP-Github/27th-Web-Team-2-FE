import { HTMLAttributes } from 'react';

import { IconName, icons } from '../../assets/icons';
import { ICON_SIZES } from './constants';
import { IconSize } from './types';
interface IconProps extends HTMLAttributes<HTMLDivElement> {
  name: IconName;
  size?: IconSize | number;
  className?: string;
  color?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Icon = ({
  name,
  size = 'md',
  className,
  color,
  ref,
  ...props
}: IconProps) => {
  const sizeValue =
    typeof size === 'number'
      ? size
      : (ICON_SIZES[size as IconSize] ??
        (typeof size === 'string' && !isNaN(Number(size))
          ? Number(size)
          : ICON_SIZES['md']));

  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <div
      ref={ref}
      className={`inline-flex shrink-0 items-center justify-center ${className || ''}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        color: color,
      }}
      role='img'
      aria-hidden={!props['aria-label']}
      {...props}
    >
      <IconComponent />
    </div>
  );
};

export default Icon;
