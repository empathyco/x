# x-jest-utils

Jest extensions for easier testing.

## How to install

```
# or pnpm or yarn
npm install @empathyco/x-jest-utils --save-dev
```

## How to use

To register the extended matchers, just import the package in your tests. The recommended way to do
so is using the [setupFilesAfterEnv](https://jestjs.io/docs/configuration#setupfilesafterenv-array)
option from your Jest config file.

```js
// File jest.config.js
module.exports = {
  setupFilesAfterEnv: ['./tests.setup.js'],
  testMatch: ['<rootDir>/**/*.spec.js'],
}
```

```js
// File tests.setup.js
import '@empathyco/x-jest-utils'
```

If you want to find out all the matchers, check the
[src/jest-utils.types.ts](src/jest-utils.types.ts) file.
