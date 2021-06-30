# Jest Utils

Jest extensions for easier testing.

### How to install

```
npm install @empathyco/x-jest-utils --save
```

### How to use

- Using `x-jest-utils` in a `TypeScript` file:

```ts
 expect(['a', 2, '3', 4]).undefinedOr(Array)

```

- Another example

```ts
 expect(['a', 2, '3', 4]).everyItemToMatch(Number);
```

You can take a look [here](./src/jest-utils.types.ts), to the rest of the matchers.

### How to update the version

You can check if a new version has been published running [npm outdated](https://docs.npmjs.com/cli/outdated):

`npm outdated @empathyco/x-jest-utils`

And update it using [npm update](https://docs.npmjs.com/cli/update):

`npm update --save @empathyco/x-jest-utils`
