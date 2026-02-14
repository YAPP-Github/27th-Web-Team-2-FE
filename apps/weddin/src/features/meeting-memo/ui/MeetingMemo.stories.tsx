import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import MeetingMemo from './MeetingMemo';

const meta: Meta<typeof MeetingMemo> = {
  title: 'Features/MeetingMemo',
  component: MeetingMemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MeetingMemo>;

export const Default: Story = {
  args: {
    initialValue: '',
    maxLength: 200,
  },
};

export const WithInitialValue: Story = {
  args: {
    initialValue: '기본 메모 내용입니다.',
    maxLength: 200,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [val, setVal] = useState(args.initialValue || '');
    return (
      <MeetingMemo
        {...args}
        initialValue={val}
        onSave={(v) => {
          console.log('saved', v);
          setVal(v);
        }}
      />
    );
  },
};
