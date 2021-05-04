const { execSync } = require('child_process');

execSync(`lerna publish from-package --yes`);
const changedPackages = JSON.parse(execSync('lerna changed --json', { encoding: 'utf-8' }));
execSync(`git commit -m "chore(release): publish release" -a`);
changedPackages.forEach(changed => {
  execSync(`git tag ${ changed.name }@${ changed.version }`);
});

