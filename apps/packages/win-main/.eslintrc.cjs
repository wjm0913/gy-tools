/* eslint-env node */
const { base, html, react, ignorePatterns } = require('@gy-tools/codelint/eslintrc.shared.cjs')

module.exports = {
  root: true,
  ...base,
  overrides: [
    html,
    {
      ...react,
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
