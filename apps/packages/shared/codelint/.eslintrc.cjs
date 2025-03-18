/* eslint-env node */
const { base, typescript } = require('./eslintrc.shared.cjs')

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
}
