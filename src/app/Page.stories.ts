import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Home from './page';

const meta = {
  title: 'Example/Page',
  component: Home,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default_Page: Story = {};
