# x-deep-merge

Utility for deep cloning objects.

### How to install

```
npm install @empathyco/x-deep-merge --save
```

### How to use

[TypeScript Module Resolution Logic](https://www.typescriptlang.org/docs/handbook/module-resolution.html) makes it quite easy. The `package.json` file contains `main` attribute that points to the generated `dist/client.js` file and `typings` attribute that points to the generated `dist/client.d.ts` file. You can also import this package as a module:

- Using `x-deep-merge` in a `TypeScript` file:

```ts
import { deepMerge } from '@empathyco/x-deep-merge';

const target = {};
const source1 = { a: 1 };
const source2 = { b: 2 };

deepMerge(target, source1, source2); // target = { a: 1, b: 2 }
```

- Another example

```ts
import { deepMerge } from '@empathyco/x-deep-merge';

const sources = [{ a: 1 }, { b: 2 }];
const mergedObject = deepMerge({}, ...sources); // mergedObject = { a: 1, b: 2 }
```

If you want to find out all the covered use cases, check the `tests` folder.

### How to update the version

You can check if a new version has been published running [npm outdated](https://docs.npmjs.com/cli/outdated):

`npm outdated @empathyco/x-deep-merge`

And update it using [npm update](https://docs.npmjs.com/cli/update):

`npm update --save @empathyco/x-deep-merge`
