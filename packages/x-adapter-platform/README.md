# x-adapter-platform

**Empathy Platform Adapter** is a library to ease the communication with **empathy.co**
[Search Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html).
Built upon [x-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter) library, it
contains a sample configuration for setup, global configurations, mappers and models.

<br>

## Tech Stack

[![TypeScript](https://img.shields.io/badge/-typescript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/-jest-C21325?logo=jest&logoColor=white&style=for-the-badge)](https://jestjs.io/)

<br>

## Installation

```
npm i @empathyco/x-adapter-platform
```

<br>

## Configuration & Usage

The PlatformAdapter interface is a configuration object for each Search Platform API’s endpoint:

```ts
export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter,
  popularSearches: popularSearchesEndpointAdapter,
  recommendations: recommendationsEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  querySuggestions: querySuggestionsEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  identifierResults: identifierResultsEndpointAdapter,
  tagging: taggingEndpointAdapter
};
```

```
TO DO: Explain each endpoint adapter
```

<br>

## ### Extending the x-platform-adapter

If you are not using the
[Search Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html),
you can extend the \***\*`x-adapter-platform` \*\***when your API needs don’t differ too much, or
create a new adapter from scratch using
the `[@empathyco/x-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter)` package.

```
TO DO: Extending an adapter that uses schemas
```

<br>

## Test

**Empathy Adapter Platform** features are tested using [Jest](https://jestjs.io/). You will find a
`__tests__` folder inside the `src` folder with tests for each of the endpoint calls, and also
inside each of the project's sections functionalities (`endpoint-adapters`, `mappers` and
`schemas`).

```
npm test
```

<br>

## Changelog

[Changelog summary](https://github.com/empathyco/x/blob/main/packages/x-adapter-platform/CHANGELOG.md)

<br>

## Contributing

To start contributing to the project, please take a look to
our **[Contributing Guide](https://github.com/empathyco/x/blob/HEAD/.github/CONTRIBUTING.md).** Take
in account that `x-adapter-platform` is developed using
[Typescript](https://www.typescriptlang.org/), so we recommend you check it out.

<br>

## License

[empathyco/x License](https://github.com/empathyco/x/blob/main/packages/x-adapter-platform/LICENSE)
