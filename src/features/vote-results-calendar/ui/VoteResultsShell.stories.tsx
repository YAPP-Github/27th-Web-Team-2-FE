// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';

import { VoteResultsShell } from './VoteResultsShell';

const fn = () => {
  return () => {};
};

const meta = {
  title: 'Features/VoteResultsCalendar/VoteResultsShell',
  component: VoteResultsShell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedDate: { control: 'text' },
  },
} satisfies Meta<typeof VoteResultsShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockDate = '2026-02-22';
const mockSelectedStat = {
  date: mockDate,
  can: [
    { id: '1', name: '김철수' },
    { id: '2', name: '이영희' },
    { id: '3', name: '박민수' },
    { id: '4', name: '정지훈' },
    { id: '5', name: '최유리' },
  ],
  cannot: [
    { id: '6', name: '강동원' },
    { id: '7', name: '송혜교' },
  ],
};

const mockEmptyStat = {
  date: '2026-02-23',
  can: [],
  cannot: [],
};

const CalendarPlaceholder = () => (
  <div className='flex h-80 w-full min-w-[320px] items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-slate-400'>
    ReactDatepicker Placeholder
  </div>
);

export const Default: Story = {
  args: {
    selectedDate: mockDate,
    selectedStat: mockSelectedStat,
    onCloseDetail: fn(),
    children: <CalendarPlaceholder />,
  },
};

export const Empty: Story = {
  args: {
    selectedDate: mockEmptyStat.date,
    selectedStat: mockEmptyStat,
    onCloseDetail: fn(),
    children: <CalendarPlaceholder />,
  },
};

export const Closed: Story = {
  args: {
    selectedDate: null,
    selectedStat: null,
    onCloseDetail: fn(),
    children: <CalendarPlaceholder />,
  },
};
