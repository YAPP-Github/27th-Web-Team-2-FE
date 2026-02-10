import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { type IconName, icons } from '@/shared/assets/icons/iconRegistry';

import { ICON_SIZES } from './constants';
import Icon from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Shared/UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(icons),
      description: 'Icon name',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 48, 64],
      description: 'Icon size token or number',
    },
    color: {
      control: 'color',
      description: 'Inline style color',
    },
    className: {
      control: 'text',
      description: 'Tailwind CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

// 1. Default Playground
export const Default: Story = {
  args: {
    name: 'ic_hamburger',
    size: 'md',
  },
};

// 2. All Sizes
export const Sizes: Story = {
  render: () => (
    <div className='flex items-end gap-4'>
      {(Object.keys(ICON_SIZES) as Array<keyof typeof ICON_SIZES>).map(
        (size) => (
          <div key={size} className='flex flex-col items-center gap-2'>
            <Icon name='ic_circle_check_filled' size={size} />
            <span className='text-xs text-gray-500'>
              {size} ({ICON_SIZES[size]}px)
            </span>
          </div>
        ),
      )}
      <div className='flex flex-col items-center gap-2'>
        <Icon name='ic_circle_check_filled' size={48} />
        <span className='text-xs text-gray-500'>custom (48px)</span>
      </div>
    </div>
  ),
};

// 3. Colors
export const Colors: Story = {
  render: () => (
    <div className='flex gap-4'>
      <div className='flex flex-col items-center gap-2'>
        <Icon name='ic_magic' size='lg' className='text-blue-500' />
        <span className='text-xs text-gray-500'>Tailwind (text-blue-500)</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <Icon name='ic_magic' size='lg' color='#FF5733' />
        <span className='text-xs text-gray-500'>
          Prop (color=&quot;#FF5733&quot;)
        </span>
      </div>
      <div className='flex flex-col items-center gap-2 text-green-600'>
        <Icon name='ic_magic' size='lg' />
        <span className='text-xs text-gray-500'>
          Inherited (text-green-600)
        </span>
      </div>
    </div>
  ),
};

// 4. Icon Gallery
export const Gallery: Story = {
  render: () => {
    const iconNames = Object.keys(icons).sort();
    return (
      <div className='grid grid-cols-4 gap-8 p-4 md:grid-cols-6 lg:grid-cols-8'>
        {iconNames.map((name) => (
          <div
            key={name}
            className='flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50'
          >
            <Icon name={name as IconName} size='lg' className='text-gray-700' />
            <span className='text-center text-[10px] break-all text-gray-400'>
              {name}
            </span>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
