import server from '@rocket.chat/jest-presets/server';
import type { Config } from 'jest';

export default {
       preset: server.preset,
       moduleNameMapper: {
               '^@rocket.chat/models$': '<rootDir>/../models/src',
       },
} satisfies Config;
