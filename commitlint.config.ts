import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'docs',
        'feat',
        'fix',
        'hotfix',
        'refactor',
        'style',
        'test',
        'design',
        'config',
      ],
    ],
  },
};

export default config;
