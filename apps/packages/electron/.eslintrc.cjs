/* eslint-env node */
const { base, typescript, ignorePatterns } = require('@gy-tools/codelint/eslintrc.shared.cjs')

module.exports = {
  root: true,
  ...base,
  overrides: [
    {
      ...typescript,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  ignorePatterns: [
    ...ignorePatterns,
    'vendors',
    'dist',
  ],
}
