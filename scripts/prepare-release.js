const { exec } = require('./utils');

const [releaseKind = 'stable'] = process.argv.slice(2);
const releaseKindArgument = releaseKind === 'alpha' ? '--conventional-prerelease' : '--conventional-graduate';

[
  `lerna version --conventional-commits --no-git-tag-version --yes ${ releaseKindArgument }`,
  `git commit -m "chore(release): prepare ${releaseKind} release" -a`
].forEach(exec);