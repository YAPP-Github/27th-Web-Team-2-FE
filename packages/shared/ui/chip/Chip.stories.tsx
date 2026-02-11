import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Chip from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Shared/UI/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['line', 'fill'],
      description: '칩의 스타일 변형',
    },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md'],
      description: '칩의 크기',
    },
    selected: {
      control: 'boolean',
      description: '선택 여부',
    },
    text: {
      control: 'text',
      description: '표시할 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    text: 'Chip',
    variant: 'line',
    size: 'xs',
    selected: false,
  },
};

export const LineSelected: Story = {
  args: {
    text: 'Selected Line',
    variant: 'line',
    size: 'sm',
    selected: true,
  },
};

export const Fill: Story = {
  args: {
    text: 'Fill Mode',
    variant: 'fill',
    size: 'md',
    selected: false,
  },
};

export const FillSelected: Story = {
  args: {
    text: 'Selected Fill',
    variant: 'fill',
    size: 'md',
    selected: true,
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <span className='w-10 text-xs text-gray-500'>XS:</span>
        <Chip {...args} size='xs' />
      </div>
      <div className='flex items-center gap-2'>
        <span className='w-10 text-xs text-gray-500'>SM:</span>
        <Chip {...args} size='sm' />
      </div>
      <div className='flex items-center gap-2'>
        <span className='w-10 text-xs text-gray-500'>MD:</span>
        <Chip {...args} size='md' />
      </div>
    </div>
  ),
  args: {
    text: 'Chip Size',
    variant: 'line',
    selected: false,
  },
};
