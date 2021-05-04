const { execSync } = require('child_process');

const [kind = 'stable'] = process.argv.slice(2);
const preReleaseArgument = kind === 'alpha' ? '--conventional-prerelease ' : '';
execSync(`lerna version --conventional-commits --no-git-tag-version --yes ${preReleaseArgument}`)
execSync('git commit -m "chore(release): prepare release" -a');