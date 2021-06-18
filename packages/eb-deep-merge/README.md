# TypeScript DeepMerge

This project is meant to be used for deep cloning objects into another objects.

### How to import this Client in other Front projects

The first thing you'll need to do before importing this Client is to configure locally the EmpathyBroker's NPM private repository (see how to do it [here](https://searchbroker.atlassian.net/wiki/)).

Once you have done that, you will be able to include this library as a dependency of any other project by using the command `npm install --save @empathybroker/deep-merge` ([doc](https://docs.npmjs.com/cli/install)).

### How to use this Client in other Front projects

Here is a quick example of how this Client can be used in other projects. The [TypeScript Module Resolution Logic](https://www.typescriptlang.org/docs/handbook/module-resolution.html) makes it quite easy. The `package.json` file contains `main` attribute that points to the generated `dist/client.js` file and `typings` attribute that points to the generated `dist/client.d.ts` file, so you'll be able to use this Client importing it into your code like this:

- Using 'DeepMerge' in a TypeScript file:

```ts
import {deepMerge} from '@empathybroker/deep-merge';

const target = {};
const source1 = {a: 1};
const source2 = {b: 2};
deepMerge(target, source1, source2);

// target now has the value {a: 1, b:2}
```
Another usage option
```ts
import {deepMerge} from '@empathybroker/deep-merge';

const sources = [{a: 1}, {b: 2}];
const mergedObject = deepMerge({}, ...sources);

// mergedObject now has the value {a: 1, b:2}
```

You can check the `tests`folder to see what this library does and what it doesn't.

### How to update the version of this Client

Once you have included this Client as a dependency of your project, you'll be able to check if there is a new version and update it if it is necessary.

To check if a new version exists, run the command `npm outdated @empathybroker/deep-merge` ([doc](https://docs.npmjs.com/cli/outdated)); to update this library to its last version on your own project, rum `npm update --save @empathybroker/deep-merge`  ([doc](https://docs.npmjs.com/cli/update)).
