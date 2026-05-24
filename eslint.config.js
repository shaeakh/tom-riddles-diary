import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier, // Placed last so Prettier overrides formatting conflicts
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Handles padding rules for both functions and imports natively
      'padding-line-between-statements': [
        'error',
        // 1. Enforce exactly 1 blank line after the last import statement
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' }, // Allows multiple imports to group together without spaces

        // 2. Enforce exactly 1 blank line after all block statements (functions, classes, loops)
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],

      // 3. Throw an error if the 'any' type is used in TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);