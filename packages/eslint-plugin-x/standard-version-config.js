module.exports = {
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'docs', section: 'Documentation' },
    { type: 'style', section: 'Styling' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'test', section: 'Testing' },
    { type: 'build', section: 'Build System' },
    { type: 'ci', section: 'Continuous Integration' },
    { type: 'chore', section: 'Others', hidden: true },
    { type: 'revert', section: 'Reverts', hidden: true }
  ],
  issueUrlFormat: 'https://searchbroker.atlassian.net/browse/EX-{{id}}',
  issuePrefixes: ['EX-']
};
