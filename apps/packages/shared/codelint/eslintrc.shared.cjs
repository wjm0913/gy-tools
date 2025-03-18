const baseRule = {
  'no-new': 'off',
  camelcase: 'off',
  'no-return-assign': 'off',
  'space-before-function-paren': ['error', 'never'],
  'no-var': 'error',
  'no-fallthrough': 'off',
  eqeqeq: 'off',
  'require-atomic-updates': ['error', { allowProperties: true }],
  'no-multiple-empty-lines': [1, { max: 2 }],
  'comma-dangle': [2, 'always-multiline'],
  'standard/no-callback-literal': 'off',
  'prefer-const': 'off',
  'no-labels': 'off',
  'node/no-callback-literal': 'off',
  'multiline-ternary': 'off',
}
const typescriptRule = {
  ...baseRule,
  '@typescript-eslint/strict-boolean-expressions': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/space-before-function-paren': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/restrict-template-expressions': [1, {
    allowBoolean: true,
    allowAny: true,
  }],
  '@typescript-eslint/restrict-plus-operands': [1, {
    allowBoolean: true,
    allowAny: true,
  }],
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksVoidReturn: {
        arguments: false,
        attributes: false,
      },
    },
  ],
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/return-await': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/comma-dangle': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
}
// const baseRule = {
//   // 末尾分号
//   // semi: [1],
//   // eslint built-in rules
//   // 不需要返回就用 forEach
//   'array-callback-return': 2,
//   // eqeq 可能导致潜在的类型转换问题
//   eqeqeq: 2,
//   'for-direction': 2,
//   // 不加 hasOwnProperty 判断会多出原型链的内容
//   'guard-for-in': 2,
//   'no-async-promise-executor': 2,
//   'no-case-declarations': 2,
//   'no-debugger': 2,
//   'no-delete-var': 2,
//   'no-dupe-else-if': 2,
//   'no-duplicate-case': 2,
//   // eval（）可能导致潜在的安全问题
//   'no-eval': 2,
//   'no-ex-assign': 2,
//   'no-global-assign': 2,
//   'no-invalid-regexp': 2,
//   // 没必要改 native 变量
//   'no-native-reassign': 2,
//   // 修改对象时，会影响原对象；但是有些场景就是有目的
//   'no-param-reassign': 2,
//   // return 值无意义，可能会理解为 resolve
//   'no-promise-executor-return': 2,
//   'no-self-assign': 2,
//   'no-self-compare': 2,
//   'no-shadow-restricted-names': 2,
//   'no-sparse-arrays': 2,
//   'no-unsafe-finally': 2,
//   'no-unused-labels': 2,
//   'no-useless-catch': 2,
//   'no-useless-escape': 2,
//   'no-var': 2,
//   'no-with': 2,
//   'require-yield': 2,
//   'use-isnan': 2,
//   'object-curly-spacing': ['error', 'always'],

//   // config-plugin-typescript rules
//   '@typescript-eslint/indent': ['error', 2],
//   '@typescript-eslint/ban-types': 2,
//   '@typescript-eslint/no-confusing-non-null-assertion': 2,
//   '@typescript-eslint/no-dupe-class-members': 2,
//   '@typescript-eslint/no-empty-interface': 2,
//   '@typescript-eslint/no-invalid-this': 2,
//   '@typescript-eslint/no-loop-func': 2,
//   '@typescript-eslint/no-misused-new': 2,
//   '@typescript-eslint/no-namespace': 2,
//   '@typescript-eslint/no-non-null-asserted-optional-chain': 2,
//   '@typescript-eslint/no-redeclare': 2,
//   '@typescript-eslint/no-this-alias': 2,
//   '@typescript-eslint/no-unused-expressions': 2,
//   '@typescript-eslint/no-unused-vars': 2,
//   '@typescript-eslint/no-use-before-define': 2,
//   '@typescript-eslint/no-useless-constructor': 2,
//   '@typescript-eslint/triple-slash-reference': 2
// }

const reactRule = {
  ...typescriptRule,
  // config-plugin-react rules
  // button 自带 submit 属性
  'react/button-has-type': 2,
  'react/jsx-key': 2,
  'react/jsx-no-comment-textnodes': 2,
  'react/jsx-no-duplicate-props': 2,
  'react/jsx-no-target-blank': 2,
  'react/jsx-no-undef': 2,
  'react/jsx-uses-react': 2,
  'react/jsx-uses-vars': 2,
  'react/no-children-prop': 2,
  'react/no-danger-with-children': 2,
  'react/no-deprecated': 2,
  'react/no-direct-mutation-state': 2,
  'react/no-find-dom-node': 2,
  'react/no-is-mounted': 2,
  'react/no-string-refs': 2,
  'react/no-render-return-value': 2,
  'react/no-unescaped-entities': 2,
  'react/no-unknown-property': 2,
  'react/require-render-return': 2,

  // config-plugin-react-hooks rules
  'react-hooks/rules-of-hooks': 2,
}

exports.base = {
  extends: ['standard'],
  rules: baseRule,
}

exports.typescript = {
  files: ['*.ts'],
  rules: typescriptRule,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint-config-love',
  ],
}

exports.html = {
  files: ['*.html'],
  plugins: ['html'],
}

exports.react = {
  files: ['*.ts', '*.tsx'],
  rules: reactRule,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint-config-love',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
    },
  },
  ecmaFeatures: {
    jsx: true,
  },
}

exports.ignorePatterns = [
  'node_modules',
  '*.min.js',
  'dist',
]
