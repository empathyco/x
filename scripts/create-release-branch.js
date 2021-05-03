const { execSync } = require('child_process');

const branchName = process.argv.slice(2) || 'release';
createReleaseBranch(branchName)

function createReleaseBranch(name) {
  [
    'git checkout master',
    'git pull',
    `git branch -d ${name}`,
    `git push origin --delete ${name}`,
    `git checkout -b ${name}`,
    `git push -u origin ${name}`
  ].forEach(command => {
    execSync(command);
  });
}