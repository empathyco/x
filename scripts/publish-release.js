const { exec } = require('./utils');

const changedPackages = JSON.parse(exec('lerna changed --json'));
exec(`lerna publish from-package --yes`);
changedPackages.forEach(changed => {
  const tag = `${ changed.name }@${ changed.version }`;
  exec(`git tag -a ${tag} -m "${tag}"`);
});
