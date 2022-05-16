# ESLint Plugin X

The project name is just to follow the
[guidelines](https://eslint.org/docs/developer-guide/working-with-plugins) of ESLint to develop a
custom plugin, but it includes also style formatter and good practices outside ESLint:

- [ESLint](https://eslint.org/) and third-party plugins
- [Prettier](https://prettier.io/)

## ESLint

### Installation

You can install the linter plugin using NPM:

```
npm install @empathyco/eslint-plugin-x --save-dev
```

The plugin offers different levels of configuration depending on the plugins and rules we want to
activate:

| Severity        | Plugins               |
| --------------- | --------------------- |
| **standard**    | ESLint                |
|                 | TypeScript            |
|                 | Prettier              |
| **recommended** | _standard plugins_    |
|                 | JSDoc                 |
|                 | TSDoc                 |
|                 | Import                |
|                 | Jest                  |
|                 | Cypress               |
| **all**         | _recommended plugins_ |
|                 | Vue                   |

### Usage

Add `plugin:@empathyco/x` to the extends section of your `.eslintrc` configuration file followed by
the severity config that you want to activate `standard`, `recommended` or `all`. You can omit the
`eslint-plugin-` prefix.

```
{ "extends": ["plugin:@empathyco/x/standard"] }
```

or

```
{ "extends": ["plugin:@empathyco/x/recommended"] }
```

or

```
{ "extends": ["plugin:@empathyco/x/all"] }
```

## Prettier

The Prettier configuration is available in the `prettier-config.js` file. First, delete your custom
prettier config file if you have. To use it is enough with reference it in you `package.json`:

```
"prettier": "@empathyco/eslint-plugin-x/prettier-config"
```
