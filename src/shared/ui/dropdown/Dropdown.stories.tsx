import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Dropdown from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Shared/UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    participants: {
      control: 'object',
      description: 'List of participant names',
    },
    onSelectParticipant: { action: 'selected' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    participants: [
      '나용짱',
      '쮸니',
      '윤정',
      '상민',
      '예진공주',
      '호연왕자',
      '재민누나',
      '나용',
      '김야뿌',
    ],
  },
};

export const Empty: Story = {
  args: {
    participants: [],
  },
};
