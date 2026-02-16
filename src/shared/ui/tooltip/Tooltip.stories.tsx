import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Shared/UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    visible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    message: '툴팁 내용이 들어갑니다',
    children: (
      <button className='rounded bg-gray-200 px-4 py-2'>
        마우스를 올려보세요
      </button>
    ),
  },
};

export const AlwaysVisible: Story = {
  args: {
    message: '항상 보이는 툴팁',
    children: <div className='h-10 w-10 rounded-full bg-blue-500' />,
    visible: true,
  },
};
