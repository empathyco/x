const { exec } = require('./utils');

execLernaVersion();

function execLernaVersion() {
  const [releaseKind = 'stable'] = process.argv.slice(2);
  const releaseKindArgument =
    releaseKind === 'alpha' ? '--conventional-prerelease' : '--conventional-graduate';
  exec(`lerna version --conventional-commits --no-git-tag-version --yes ${releaseKindArgument}`);
}
