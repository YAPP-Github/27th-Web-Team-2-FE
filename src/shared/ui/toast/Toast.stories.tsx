import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Toast } from './index';

const meta: Meta<typeof Toast> = {
  title: 'Shared/UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gray', // 밝은 토스트가 잘 보이도록 배경 설정
      values: [{ name: 'gray', value: '#F3F4F6' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error'],
      description: '토스트의 스타일 변형입니다.',
    },
    message: {
      control: 'text',
      description: '토스트에 표시될 메시지입니다.',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 토스트 (성공 아이콘 + 메시지)
export const Default: Story = {
  args: {
    variant: 'default',
    message: '주소가 복사되었어요',
  },
};

// 성공 토스트
export const Success: Story = {
  args: {
    variant: 'success',
    message: '작업이 성공했습니다',
  },
};

// 에러 토스트
export const Error: Story = {
  args: {
    variant: 'error',
    message: '오류가 발생했습니다',
  },
};
