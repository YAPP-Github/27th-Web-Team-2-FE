import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import TopBar from './TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'Shared/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    leftIcon: {
      control: 'select',
      options: [
        undefined,
        'arrow_prev',
        'arrow_next',
        'ic_hamburger',
        'ic_menu_close',
        'ic_refresh',
      ],
    },
    rightIcon: {
      control: 'select',
      options: [
        undefined,
        'arrow_prev',
        'arrow_next',
        'ic_hamburger',
        'ic_menu_close',
        'ic_refresh',
      ],
    },
    iconColor: { control: 'color' },
  },
  args: {
    onLeftClick: () => console.log('Left clicked'),
    onRightClick: () => console.log('Right clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '페이지 제목',
  },
};

export const WithBack: Story = {
  args: {
    title: '페이지 제목',
    leftIcon: 'arrow_prev',
  },
};

export const WithBackAndAction: Story = {
  args: {
    title: '페이지 제목',
    leftIcon: 'arrow_prev',
    rightIcon: 'ic_menu_close',
  },
};

export const OnlyIcons: Story = {
  args: {
    leftIcon: 'ic_hamburger',
    rightIcon: 'ic_refresh',
  },
};

export const LongTitle: Story = {
  args: {
    leftIcon: 'arrow_prev',
    title:
      '엄청나게 긴 페이지 제목입니다 엄청나게 긴 페이지 제목입니다 확인해보세요',
    rightIcon: 'ic_menu_close',
  },
};
