const { exec } = require('./utils');

const changedPackages = JSON.parse(exec('lerna changed --json'));
exec(`lerna publish from-package --yes`);
changedPackages.forEach(changed => {
  exec(`git tag ${ changed.name }@${ changed.version }`);
});
