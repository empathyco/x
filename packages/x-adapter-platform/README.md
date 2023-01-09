# x-adapter-platform

**Empathy Platform Adapter** is a library to ease the communication with **empathy.co**
[Empathy Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html).
Built upon [x-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter) library, it
contains a sample configuration for setup, global configurations, mappers and models.

It is used as the default adapter configuration in
[x-archetype](https://github.com/empathyco/x-archetype), a standardised implementation of the
[x-components](https://github.com/empathyco/x/tree/main/packages/x-components) library, which
imports it as a plugin.

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

The PlatformAdapter instance is a configuration object for each Empathy Platform API’s endpoints:

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

<br>

### Platform Endpoint Adapters & usage

This API has the particularity of needing an `env`, `instance` and a `language` to be passed in each
endpoint call. For that purpose, you will need to use the `extraParams` field to specify them and
make it work. In an [x-archetype](https://github.com/empathyco/x-archetype) project context, which
would be the recommended scenario to use this package, these parameters are configured used a
[snippetConfig.js](https://github.com/empathyco/x-archetype/blob/main/public/snippet-script.js)
file.

<br>

##### Search endpoint adapter

###### endpoint: /search/v1/query/{extraParams.instance}/search

Search **results**. A search request is triggered when the user has typed or accepted a query. The
response is mapped and usually shown in a grid.

```ts
const { results } = await platformAdapter.search({
  query: 'trousers',
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Popular searches endpoint adapter

###### endpoint: /search/v1/query/{extraParams.instance}/empathize

Top searched queries. Usually these **suggestions** are shown inside the predictive layer when the
input has no query.

```ts
const { suggestions } = await platformAdapter.popularSearches({
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Recommendations endpoint adapter

###### endpoint: /search/v1/query/{extraParams.instance}/topclicked

Top clicked products. Usually these **recommendations** are shown inside the predictive layer when
the input has no query or in the result grid.

```ts
const { results } = await platformAdapter.recommendations({
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Next Queries endpoint adapter

###### endpoint: /nextqueries/{extraParams.instance}

Next queries are shown after a search request has been made. They are recurring searches that users
tend to do after searching for a specific item.

```ts
const { nextQueries } = await platformAdapter.nextQueries({
  query: 'trousers',
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Query suggestions endpoint adapter

###### endpoint: /search/v1/query/{extraParams.instance}/empathize

These **suggestions** help users to refine their searches while they are typing. So, depending on
the query, a list of terms that could complete the search will be suggested. For example, for the
query "trousers" we could have "trousers summer, trousers grey, trousers men, trousers woman...." as
query suggestions.

```ts
const { suggestions } = await platformAdapter.querySuggestions({
  extraParams: {
    query: 'trousers',
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Related tags endpoint adapter

###### endpoint: /relatedtags/{extraParams.instance}

Related tags depend on what users are searching for. They are used to help to filter a query search
by adding more **specificity** (e.g, adjectives: log, short, gluten-free, categories: kids,
summer...). Usually they are show below the search-box with tag appearance after a search request
has been made.

```ts
const { relatedTags } = await platformAdapter.relatedTags({
  extraParams: {
    query: 'trousers',
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Identifier results endpoint adapter

###### endpoint: /search/v1/query/{extraParams.instance}/skusearch

This endpoint is similar to the search endpoint, but instead of searching by query, it searches by a
specific product identifiable, the SKU number.

```ts
const { sku } = await platformAdapter.skuSearch({
  extraParams: {
    query: '1234',
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Tagging endpoint adapter

###### endpoint: ({ url }) => url

The `TaggingRequest` is made up of an url and a params object, it allows sending events to a server
to collect metrics about how the search is performing (this won't collect user data, just the use of
tools per session). The `x-adapter-platform` adapter uses the
[`x-types`](https://github.com/empathyco/x/tree/main/packages/x-types) `Taggable` events object,
which contain `add2cart`, `checkout`, `click`, `query` and `wishlist` actions.

```ts
const tagging = await platformAdapter.tagging({
  url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/query',
  // Info that will be sent along with the query event
  params: {
    filtered: 'false',
    lang: 'en',
    origin: 'customer:no_query',
    page: '1',
    q: 'trousers',
    scope: 'desktop',
    spellcheck: 'false',
    totalHits: 700
  }
});
```

<br>

### Modifying the x-platform-adapter

Each request and response schemas are created as `MutableSchemas`, so they can be modified using the
`$extends`, `$override`, `$replace` methods accordingly. You can check the
[`x-adapter`](https://github.com/empathyco/x/tree/main/packages/x-adapter/README.md)'s package
documentation for further details.

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

To start contributing to the project, please take a look to our
**[Contributing Guide](https://github.com/empathyco/x/blob/HEAD/.github/CONTRIBUTING.md).** Take in
account that `x-adapter-platform` is developed using [Typescript](https://www.typescriptlang.org/),
so we recommend you check it out.

<br>

## License

[empathyco/x License](https://github.com/empathyco/x/blob/main/packages/x-adapter-platform/LICENSE)
