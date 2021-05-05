const { exec } = require('./utils');

const [kind = 'stable'] = process.argv.slice(2);
const preReleaseArgument = kind === 'alpha' ? '--conventional-prerelease ' : '';

[
  `lerna version --conventional-commits --no-git-tag-version --yes ${ preReleaseArgument }`,
  'git commit -m "chore(release): prepare release" -a'
].forEach(exec);