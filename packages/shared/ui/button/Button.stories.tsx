import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Button from './Button';

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: '버튼 텍스트' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    fullWidth: { control: 'boolean', description: '너비 100% 여부' },
    onClick: { action: 'clicked', description: '클릭 핸들러' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 형태 (Default)
export const Default: Story = {
  args: {
    children: '일정 투표하기',
  },
};

// 비활성화 상태 (Disabled)
export const Disabled: Story = {
  args: {
    children: '일정 투표하기',
    disabled: true,
  },
};

// 전체 너비 (Full Width)
export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    children: '날짜 선택하기',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// 긴 텍스트 (Long Text)
export const LongText: Story = {
  args: {
    children: '아주 긴 버튼 텍스트가 들어가면 어떻게 보일까요',
  },
};

// 짧은 텍스트 (Short Text)
export const ShortText: Story = {
  args: {
    children: '확인',
  },
};

// 클릭 이벤트 (With Click Event)
export const WithClickEvent: Story = {
  args: {
    children: '클릭해보세요',
    onClick: () => alert('버튼이 클릭되었습니다!'),
  },
};
