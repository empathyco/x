# ESLint Plugin X

The project name is just to follow the 
[guidelines](https://eslint.org/docs/developer-guide/working-with-plugins) of ESLint to develop a
custom plugin, but it includes also style formatter and good practices outside ESLint:
* ESLint and third-party plugins
* Prettier
* standard-version

## ESLint

### Installation

You can install the linter plugin using NPM:

```
npm install @empathy/eslint-plugin-x --save-dev
```

The plugin offers different levels of configuration depending on the plugins and rules we want to 
activate:

| Severity    	    | Plugins             	|
|------------------	|---------------------	|
| **standard**    	| ESLint              	|
|             	    | TypeScript          	|
|             	    | Prettier            	|
| **recommended** 	| standard plugins +    |
|             	    | JSDoc               	|
|             	    | TSDoc               	|
|             	    | Import              	|
|             	    | Jest                	|
|             	    | Cypress             	|
| **all**         	| recommended plugins + |
|             	    | Vue                 	|

### Usage

Add `plugin:@empathy/x` to the extends section of your `.eslintrc` configuration file followed by
the severity config that you want to activate `standard`, `recommended` or `all`. You can omit the 
`eslint-plugin-` prefix. 

```
{ "extends": ["plugin:@empathy/x/standard"] }
```
or
```
{ "extends": ["plugin:@empathy/x/recommended"] }
```
or
```
{ "extends": ["plugin:@empathy/x/all"] }
```

## Prettier

The Prettier configuration is available in the `prettier-config.js` file. To use it is enough
with reference it in you `package.json`:
 
```
"prettier": "@empathy/eslint-plugin-x/prettier-config"
```

## standard-version

It is an util for versioning using [semver](https://semver.org/) and CHANGELOG generation powered
by [Conventional Commits](https://www.conventionalcommits.org/).

The configuration is available in the `standard-version-config.js` file. To use it you need to
extend your `.versionrc.js` configuration with this one.

```
module.exports = {
  header: '# <PROJECT_NAME>',
  ...require('@empathy/eslint-plugin-x/standard-version-config')
}
```
