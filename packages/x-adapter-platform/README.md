# x-adapter-platform

**Empathy Platform Adapter** is a library to ease the communication with **empathy.co**
[Empathy Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html).
Built upon the [x-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter) library, it
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

The `PlatformAdapter` is an object containing several endpoint adapters.

Each `EndpointAdapter` contains the configuration of an endpoint, including the URL, the mapper to
adapt the responses and the requests, the request options ...

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

The
[Empathy Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html)
has the particularity of needing an `env`, `instance` and a `language` to be passed in each endpoint
call (except the tagging).

In an [x-archetype](https://github.com/empathyco/x-archetype) project context, which would be the
recommended scenario to use this package, these parameters are configured through the
[snippetConfig](https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-archetype-integration-guide.html#snippet-configuration).

If you are not using the `x-platform-adapter` inside an `x-archetype` based project, but you want to
use the **Empathy Platform API**, you can use the `extraParams` field to specify the required
parameters to make it work, as shown in the examples below.

<br>

##### Search endpoint adapter

- endpoint: `/search/v1/query/{extraParams.instance}/search`
- request:
  [`SearchRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/search-request.model.ts)
- response:
  [`SearchResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/search-response.model.ts)

The search endpoint will include an
[array of results](https://github.com/empathyco/x/blob/main/packages/x-types/src/result/result.model.ts)
in its response.

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

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

- endpoint: `/search/v1/query/{extraParams.instance}/empathize`
- request:
  [`PopularSearchesRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/popular-searches-request.model.ts)
- response:
  [`PopularSearchesResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/popular-searches-response.model.ts)

The `PopularSearches` endpoint will return top searched queries.

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

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

- endpoint: `/search/v1/query/{extraParams.instance}/topclicked`
- request:
  [`RecommendationsRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/recommendations-request.model.ts)
- response:
  [`RecommendationsResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/recommendations-response.model.ts)

These **recommendations** are top clicked products based on user click interactions (note: no personal user data is collected).

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

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

- endpoint: `/nextqueries/{extraParams.instance}`
- request:
  [`NextQueriesRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/next-queries-request.model.ts)
- response:
  [`NextQueriesResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/next-queries-response.model.ts)

The `NextQueries` endpoint returns recurring searches that users tend to do after searching for a
specific item. The aim is to suggest a new term that the user may be interested in.

The `NextQueriesRequest` is usually done after a `SearchRequest` has been made.

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

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

- endpoint: `/search/v1/query/{extraParams.instance}/empathize`
- request:
  [`QuerySuggestionsRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/query-suggestions-request.model.ts)
- response:
  [`QuerySuggestionsResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/query-suggestions-response.model.ts)

The `QuerySuggestions` endpoint returns suggestions based on a query. For example, for the query
"trousers" we could have "denim trousers, cargo trousers, chino trousers, etc..." as query
suggestions.

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

const { suggestions } = await platformAdapter.querySuggestions({
  query: 'trousers',
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Related tags endpoint adapter

- endpoint: `/relatedtags/{extraParams.instance}`
- request:
  [`RelatedTagsRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/related-tags-request.model.ts)
- response:
  [`RelatedTagsResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/related-tags-response.model.ts)

The `RelatedTags` endpoint will return terms used to help refining a search query by adding more
**specificity** (e.g, adjectives: log, short, gluten-free, categories: kids, summer...).

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

const { relatedTags } = await platformAdapter.relatedTags({
  query: 'trousers',
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Identifier results endpoint adapter

- endpoint: `/search/v1/query/{extraParams.instance}/skusearch`
- request:
  [`IdentifierResultsRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/identifier-results-request.model.ts)
- response:
  [`IdentifierResultsResponse`](https://github.com/empathyco/x/blob/main/packages/x-types/src/response/identifier-results-response.model.ts)

The `IdentifierResults` endpoint will return the results whose
[identifier](https://github.com/empathyco/x/blob/main/packages/x-types/src/identifiable.model.ts)
matches a given `query`.

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

const { results } = await platformAdapter.identifierResults({
  query: '1234',
  extraParams: {
    lang: 'en',
    instance: 'empathy',
    env: 'staging'
  }
});
```

<br>

##### Tagging endpoint adapter

- endpoint: `({ url }) => url`
- request:
  [`TaggingRequest`](https://github.com/empathyco/x/blob/main/packages/x-types/src/request/tagging-request.model.ts)
- response: `void`

The `Tagging` endpoint allows sending events to a server to collect metrics about how the search is
performing (this won't collect user data, just the use of tools per session).

You can configure your `tagging` object following the
[`Taggable`](https://github.com/empathyco/x/blob/main/packages/x-types/src/tagging.model.ts)
interface, which contains several user actions and the capability to include your own.

```ts
import { platformAdapter } from '@empathyco/x-adapter-platform';

const tagging = await platformAdapter.tagging({
  // The tagging request will be sent to this URL
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

###### Example of overriding a response by adding a new parameter

```ts
import { PlatformResult, resultSchema } from '@empathyco/x-adapter-platform';
import { Result } from '@empathyco/x-types';

interface EmpathyDemoPlatformResult extends PlatformResult {
  season: string;
}

declare module '@empathyco/x-types' {
  export interface Result {
    season: string;
  }
}

resultSchema.$override<EmpathyDemoPlatformResult, Partial<Result>>({
  season: 'season'
});
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

To start contributing to the project, please take a look to our
**[Contributing Guide](https://github.com/empathyco/x/blob/HEAD/.github/CONTRIBUTING.md).** Take in
account that `x-adapter-platform` is developed using [Typescript](https://www.typescriptlang.org/),
so we recommend you check it out.

<br>

## License

[empathyco/x License](https://github.com/empathyco/x/blob/main/packages/x-adapter-platform/LICENSE)
