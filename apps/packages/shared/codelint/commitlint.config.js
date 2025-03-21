/**
 * feat：新功能（feature）。
 * fix/to：修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。
 * ● fix：产生diff并自动修复此问题。适合于一次提交直接修复问题
 * ● to：只产生diff不自动修复此问题。适合于多次提交。最终修复问题提交时使用fix
 * docs：文档（documentation）。
 * style：格式（不影响代码运行的变动）。
 * refactor：重构（即不是新增功能，也不是修改bug的代码变动）。
 * perf：优化相关，比如提升性能、体验。
 * test：增加测试。
 * chore：构建过程或辅助工具的变动。
 * revert：回滚到上一个版本。
 * merge：代码合并。
 * sync：同步主线或分支的Bug。
 */
module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
  rules: {
    'type-enum': [
      2,
      // body换行
      'always',
      // 同 git commit 规范
      [
        'feat', 'fix', 'to', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'merge', 'sync',
        'add', 'del', 'bump', 'conf', 'reformat', 'optimize', 'doc', 'start', 'end',
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72], // header 最长72
  },
}
