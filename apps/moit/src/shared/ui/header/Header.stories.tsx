import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Shared/UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subHeader', 'thirdTitle'],
      description: '헤더의 스타일 변형을 선택합니다.',
    },
    title: {
      control: 'text',
      description: '헤더의 메인 타이틀입니다.',
    },
    subTitle: {
      control: 'text',
      description: '서브 헤더나 Third Title에서 사용되는 서브 텍스트입니다.',
    },
    voteCount: {
      control: 'number',
      description: 'Default 변형에서 사용되는 투표 수입니다.',
    },
    standardTime: {
      control: 'text',
      description: 'Default 변형에서 사용되는 기준 시간입니다.',
    },
    onRefresh: { action: 'refreshed' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    variant: 'default',
    voteCount: 8,
    standardTime: '20:13',
  },
};

export const SubHeader: Story = {
  args: {
    variant: 'subHeader',
    title: '텍스트가 두 줄로 들어갑니다.',
  },
};

export const ThirdTitle: Story = {
  args: {
    variant: 'thirdTitle',
    title: '텍스트가 두 줄로 들어갑니다.',
    subTitle: '서브 텍스트가 들어갑니다.',
  },
};
