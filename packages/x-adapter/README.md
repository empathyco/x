# x-adapter

**Empathy Search Adapter** is a library of utils to ease the communication with any API.

Some features that it provides:

- Create an API request function based on a simple configuration.
- Allow to configure several endpoints by extending the initial configuration.
- Allow to configure the response/request mapping.
- Create mapping functions based on Schemas.

## Installation

```
npm i @empathyco/x-adapter
```

You can additionally install the
[@empathyco/x-types](https://github.com/empathyco/x/tree/main/packages/search-types) package and
take the advantage of it in your project development.

## Configuration & Usage

The `Adapter` instance is meant to be a configuration object for each `EndpointAdapter`, handling
each data model that will need to be passed/mapped/transformed to meet your app’s environment and
the API requirements.

```tsx
// PlatformAdapter definition example with 3 endpoint adapters

import { XComponentsAdapter } from './types/platform-adapter.types';

export const adapter: XComponentsAdapter = {
  search: searchEndpointAdapter,
  popularSearches: popularSearchesEndpointAdapter,
  recommendations: recommendationsEndpointAdapter
  // ... any endpoints your project may need
};
```

### Implement your own adapter

Use the `EndpointAdapterOptions` to configure the params needed to handle your request. The params
that can be configured are: `endpoint`, `httpClient`, `defaultRequestOptions` and the
request/response `mappers`.

Take in account that if your use our `SearchRequest` and `SearchResponse`
[search-types](https://github.com/empathyco/x/tree/main/packages/search-types), you will need to map
some fields as they are required in the model.

```tsx
import { SearchRequest, SearchResponse } from '@empathyco/x-types';
import { EndpointAdapterOptions } from '@empathyco/x-adapter';

export const searchEndpointAdapter: EndpointAdapterOptions<SearchRequest, SearchResponse> = {
  endpoint: `https://${API_ENDPOINT}`,
  defaultRequestOptions: {
    properties: {
      headers: { Authorization: `${YOUR_AUTH}` }
      // ... any options your API may need
    }
  },
  requestMapper({ query, start, rows }) {
    return {
      q: query,
      limit: rows,
      offset: start
      // ... any field you need to send for your request
    };
  },
  responseMapper({ results }) {
    return {
      results: results,
      totalResults: results.length
      // ... any field you need to map from the response
    };
  }
};
```

#### Using a factory function to configure your adapter

To ease this configuration, you can also use the `x-adapter` ’s `endpointAdapterFactory` function
that defines how a request will be triggered and resolved with the given `EndpointAdapterOptions`.

```tsx
import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { SearchRequest, SearchResponse } from '@empathyco/x-types';

export const searchEndpointAdapter = endpointAdapterFactory<SearchRequest, SearchResponse>({
  endpoint: 'https://{API_ENDPOINT}',
  defaultRequestOptions: {
    properties: {
      headers: { Authorization: `${YOUR_AUTH}` }
      // ... any options your API may need
    }
  },
  // we enhance you to declare your resquest/response mappers ouside this function to improve its legibility
  requestMapper: searchRequestMapper,
  responseMapper: searchResponseMapper
});
```

### Implement your own adapter using schemas

The `x-adapter` library includes a `schemaMapperFactory` function that creates a mapper function to
execute the schema you provide. You just need to create your request and response schemas to define
the structure of your data, and pass them as a parameter to the factory function.

```tsx
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { SearchRequest } from '@empathyco/x-types';
import { searchRequestSchema } from '../../schemas/requests/search-request.schema';

// Import and use already existing types from your API source, or declare your own based on the response you get.
interface ApiRequestModel {
  q: string;
  limit?: number;
  offset?: number;
}
interface ApiResponseModel {
  items: T[];
  limit?: number;
  offset?: number;
  total: number;
}

// Maps both the request and the response to connect your model with API you are working with.
const searchRequestSchema: Schema<SearchRequest, ApiRequestModel> = {
  q: 'query',
  limit: 'rows',
  offset: 'start'
};
const searchResponseSchema: Schema<ApiResponseModel, SearchResponse> = {
  results: 'items',
  totalResults: 'items.total' // you can use paths to access to an inner property if needed
};

// The 'schemaMapperFactory' creates a mapper function for a given schema.
export const searchRequestMapper = schemaMapperFactory<SearchRequest, ApiRequestModel>(
  searchRequestSchema
);
export const searchResponseMapper = schemaMapperFactory<ApiResponseModel, SearchResponse>(
  searchResponseSchema
);
```

#### Create more complex models with Subschemas

For more complex data mapping, the `x-adapter` library also provides a `subSchema` type that
receives a `Source`, a `Target` and a `Path` that will be applied to the inner path of the main
object. Furthermore, and not restricted to using subschemas, you can also use schema with function
return types, that makes schemas powerful to custom the logic you need in your data mapping.

```tsx
// Example of using a subSchema to map a response
const responseMapper = schemaMapperFactory<ApiResponseModel, SearchResponse>({
  totalResults: 'results.total',
  results: {
    $path: 'results.items',
    $subSchema: {
      id: 'id',
      name: 'name',
      url: 'result_url',
      images: ({ result }) => result.images.map(({ url }) => url),
      price: {
        value: ({ price, sale_price }) => (sale_price ? sale_price : price)
      }
    }
  }
});
```

#### Using a mutable schema

The `x-adapter` library also provides a `MutableSchema` type, a `Schema` that can replace an
original schema, override it or create a new one based on the original one. This can be useful to
define a shared pattern that you will need to reuse in different endpoint adapters.

```tsx
import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { SearchRequest } from '@empathyco/x-types';
import { ApiRequestModel } from 'YOUR-API-SOURCE';

export const searchRequestSchema = createMutableSchema<Schema<SearchRequest, ApiRequestModel>>({
  q: 'query',
  limit: 'rows',
  offset: 'start'
  // ... any existing types from your API source
});
```

### Extend an adapter that uses schemas

You can check the
[x-platform-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter-platform) library.
You will find a sample implementation of the `x-adapter` library based on the
[Search Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html),
and also some guidance on how to extend it for your needs.

## Test

```
npm test
```

## Changelog

[Changelog summary](https://github.com/empathyco/x/blob/main/packages/x-adapter/CHANGELOG.md)

## Contributing

To start contributing to the project, please take a look to
our **[Contributing Guide](https://github.com/empathyco/x/blob/main/.github/CONTRIBUTING.md).**

## License

[empathyco/x License](https://github.com/empathyco/x/blob/main/packages/x-adapter/LICENSE)
