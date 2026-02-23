// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';

import { ReactDatePickerVoteResultsCalendar } from './ReactDatepicker';

const meta = {
  title: 'Features/VoteResultsCalendar/ReactDatepicker',
  component: ReactDatePickerVoteResultsCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReactDatePickerVoteResultsCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 날짜 범위 모의 데이터
const mockOpenRange = {
  start: '2026-01-01',
  end: '2026-03-31',
};

// 투표 관련 통계 모의 데이터
const mockStats = [
  {
    date: '2026-02-14',
    can: [
      { id: '1', name: '김철수' },
      { id: '2', name: '이영희' },
      { id: '3', name: '박지성' },
    ],
    cannot: [],
  },
  {
    date: '2026-02-15', // 일요일 (빨간색 확인)
    can: [
      { id: '1', name: '김철수' },
      { id: '4', name: '손흥민' },
    ],
    cannot: [], // 2위
  },
  {
    date: '2026-02-16', // 일요일 (빨간색 확인)
    can: [{ id: '1', name: '김철수' }],
    cannot: [], // 2위
  },
  {
    date: '2026-02-22', // 일요일 (빨간색 확인)
    can: [
      { id: '1', name: '김철수' },
      { id: '2', name: '이영희' },
      { id: '3', name: '박지성' },
      { id: '4', name: '손흥민' },
    ],
    cannot: [{ id: '5', name: '이강인' }], // 1위
  },
];

export const Default: Story = {
  args: {
    month: '2026-02',
    openRange: mockOpenRange,
    stats: mockStats,
  },
};

export const FilteredByParticipant: Story = {
  args: {
    month: '2026-02',
    openRange: mockOpenRange,
    stats: mockStats,
    focusedParticipant: '이영희',
  },
};

export const EmptyStats: Story = {
  args: {
    month: '2026-02',
    openRange: mockOpenRange,
    stats: [],
  },
};
