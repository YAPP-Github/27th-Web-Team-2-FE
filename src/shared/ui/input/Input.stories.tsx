import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import Input from './Input';

const meta = {
  title: 'Shared/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '라벨 텍스트' },
    placeholder: { control: 'text', description: '플레이스홀더 텍스트' },
    errorMessage: { control: 'text', description: '에러 메시지' },
    helperText: { control: 'text', description: '도움말 텍스트' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    fullWidth: { control: 'boolean', description: '너비 100% 여부' },
    maxLength: { control: 'number', description: '최대 입력 글자수' },
    onClear: { action: 'cleared', description: '클리어 버튼 클릭 핸들러' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 형태 (Default)
export const Default: Story = {
  args: {
    placeholder: '내용을 입력해주세요',
  },
};

// 라벨 포함 (With Label)
export const WithLabel: Story = {
  args: {
    label: '이름',
    placeholder: '홍길동',
  },
};

// 도움말 포함 (With HelperText)
export const WithHelperText: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    placeholder: '비밀번호를 입력해주세요',
    helperText: '8자 이상 입력해주세요',
  },
};

// 에러 상태 (Error State)
export const Error: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
    value: 'invalid-email',
    errorMessage: '올바른 이메일 형식이 아닙니다.',
  },
};

// 비활성화 상태 (Disabled)
export const Disabled: Story = {
  args: {
    label: '아이디',
    value: 'read-only-user',
    disabled: true,
  },
};

// 전체 너비 (Full Width)
export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    label: '주소',
    placeholder: '주소를 입력해주세요',
    fullWidth: true,
  },
};

// 최대 글자수 제한 (Max Length)
export const WithMaxLength: Story = {
  args: {
    label: '자기소개',
    placeholder: '한 줄 소개를 입력해주세요',
    maxLength: 20,
    helperText: '우측 하단에 글자수가 표시됩니다.',
  },
};

// 에러와 최대 글자수 동시 표시 (Error + Max Length)
export const ErrorWithMaxLength: Story = {
  args: {
    label: '모임장 이름',
    placeholder: '이름을 입력해주세요',
    maxLength: 10,
    value: '너무 긴 모임장 이름',
    errorMessage: '에러 내용이 뜹니다.',
  },
};

// 제어 컴포넌트 예시 (Controlled Component)
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    label: '제어 컴포넌트',
    placeholder: '한글 입력 시에도 글자수 제한이 동작합니다',
    maxLength: 10,
    helperText: 'Input 값을 React State로 관리합니다.',
  },
};
