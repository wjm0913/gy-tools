const { base, typescript } = require('@gy-tools/codelint/eslintrc.shared.cjs')

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
    'node_modules',
    'packages',
    'dist',
  ],
}
