import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../packages/shared/**/*.mdx',
    '../packages/shared/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../apps/moit/src/**/*.mdx',
    '../apps/moit/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../apps/moit/public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../apps/moit/src'),
      '@repo/shared': path.resolve(__dirname, '../packages/shared'),
    };
    return config;
  },
};
export default config;
