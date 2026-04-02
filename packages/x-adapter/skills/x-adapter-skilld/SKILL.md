---
name: x-adapter-skilld
description: TypeScript library for creating type-safe API clients with request/response mapping
---

# X Adapter - Universal API Client Library

## Overview

**@empathyco/x-adapter** is a TypeScript library for creating type-safe API clients with minimal configuration. It simplifies communication with any API by providing factories for endpoint adapters, request/response mapping, and schema-based transformations.

**Key Features:**

- Create API request functions from simple configuration
- Configure multiple endpoints by extending base config
- Map requests and responses with schema-based transformations
- Built-in HTTP client with cancellation support
- Full TypeScript support
- Zero dependencies (except `@empathyco/x-utils`)

## Installation

```bash
npm install @empathyco/x-adapter
```

**Optional but recommended:**

```bash
npm install @empathyco/x-types  # For type definitions
```

## Core Concepts

### Endpoint Adapter

An **EndpointAdapter** is a function that:

1. Accepts request data from your app
2. Transforms it to API format (via `requestMapper`)
3. Makes HTTP request (via `httpClient`)
4. Transforms API response to app format (via `responseMapper`)
5. Returns typed response data

### API Adapter

An **API Adapter** is a collection of EndpointAdapters, one per API endpoint.

## Basic Usage

### Creating a Simple Endpoint Adapter

```typescript
import { endpointAdapterFactory } from '@empathyco/x-adapter'
import { fetchHttpClient } from '@empathyco/x-adapter/http-clients'

// Define types
interface SearchRequest {
  query: string
  limit?: number
}

interface SearchResponse {
  products: Product[]
  total: number
}

// Create endpoint adapter
const searchAdapter = endpointAdapterFactory<SearchRequest, SearchResponse>({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  requestMapper: request => ({
    q: request.query,
    limit: request.limit ?? 10,
  }),
  responseMapper: response => ({
    products: response.data.items,
    total: response.data.count,
  }),
})

// Use it
const results = await searchAdapter({ query: 'shoes', limit: 20 })
console.log(results.products)
```

### EndpointAdapterFactory Options

```typescript
interface EndpointAdapterOptions<Request, Response> {
  endpoint: string | ((request: Request) => string) // URL or URL builder
  httpClient: HttpClient // HTTP function
  requestMapper?: RequestMapper<Request> // Transform request
  responseMapper?: ResponseMapper<Response> // Transform response
  defaultRequestOptions?: RequestOptions // Default config
}
```

## HTTP Clients

### Built-in Fetch Client

```typescript
import { fetchHttpClient } from '@empathyco/x-adapter/http-clients'

const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/data',
  httpClient: fetchHttpClient,
})
```

### Custom HTTP Client

```typescript
import { HttpClient } from '@empathyco/x-adapter'

const customHttpClient: HttpClient = (url, options) => {
  return axios.get(url, {
    params: options.parameters,
    headers: options.headers,
  })
}

const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/data',
  httpClient: customHttpClient,
})
```

## Request Mapping

### Static Request Mapping

Transform app data to API format:

```typescript
const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  requestMapper: appRequest => ({
    query: appRequest.searchTerm,
    page: appRequest.page,
    size: appRequest.itemsPerPage,
    filters: appRequest.activeFilters.map(f => f.id),
  }),
})
```

### Schema-based Request Mapping

Use schemas for complex transformations:

```typescript
import { schemaMapperFactory } from '@empathyco/x-adapter/mappers'

const requestSchema = {
  query: 'searchTerm', // Simple rename
  page: request => request.page + 1, // Transform with function
  filters: {
    // Nested mapping
    $path: 'activeFilters',
    $subSchema: {
      id: 'filterId',
      value: 'filterValue',
    },
  },
}

const requestMapper = schemaMapperFactory(requestSchema)

const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  requestMapper,
})
```

## Response Mapping

### Basic Response Mapping

Transform API response to app format:

```typescript
const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  responseMapper: apiResponse => ({
    items: apiResponse.data.results.map(item => ({
      id: item.productId,
      name: item.title,
      price: item.price / 100, // Convert cents to dollars
      image: item.imageUrl,
    })),
    total: apiResponse.data.totalCount,
    page: apiResponse.data.currentPage,
  }),
})
```

### Schema-based Response Mapping

```typescript
import { schemaMapperFactory } from '@empathyco/x-adapter/mappers'

const responseSchema = {
  items: {
    $path: 'data.results',
    $subSchema: {
      id: 'productId',
      name: 'title',
      price: item => item.price / 100,
      image: 'imageUrl',
    },
  },
  total: 'data.totalCount',
  page: 'data.currentPage',
}

const responseMapper = schemaMapperFactory(responseSchema)

const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  responseMapper,
})
```

## Dynamic Endpoints

Build endpoint URL from request data:

```typescript
const adapter = endpointAdapterFactory({
  endpoint: request => `https://api.example.com/products/${request.id}`,
  httpClient: fetchHttpClient,
})

// Makes request to: https://api.example.com/products/123
await adapter({ id: 123 })
```

## Request Options

### Default Request Options

Set defaults for all requests:

```typescript
const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  defaultRequestOptions: {
    id: 'search-request', // Request identifier
    cancellable: true, // Allow cancellation
    timeout: 5000, // 5 second timeout
    headers: {
      Authorization: 'Bearer token',
    },
  },
})
```

### Per-Request Options

Override defaults on each call:

```typescript
const result = await adapter(
  { query: 'shoes' },
  {
    timeout: 10000, // Override timeout
    headers: {
      'X-Custom-Header': 'value',
    },
  },
)
```

## Request Cancellation

### Enable Cancellation

```typescript
const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  defaultRequestOptions: {
    cancellable: true,
    id: 'search',
  },
})

// First request
adapter({ query: 'shoes' })

// Second request cancels the first (same id)
adapter({ query: 'boots' })
```

### Manual Cancellation

```typescript
import { cancelPendingRequest } from '@empathyco/x-adapter'

// Cancel specific request
cancelPendingRequest('search')

// Cancel all requests
cancelPendingRequest()
```

## Building a Complete API Adapter

### Full API Client Example

```typescript
import { endpointAdapterFactory } from '@empathyco/x-adapter'
import { fetchHttpClient } from '@empathyco/x-adapter/http-clients'

const BASE_URL = 'https://api.example.com'

// Search endpoint
const search = endpointAdapterFactory({
  endpoint: `${BASE_URL}/search`,
  httpClient: fetchHttpClient,
  requestMapper: request => ({
    q: request.query,
    limit: request.limit,
    filters: request.filters,
  }),
  responseMapper: response => ({
    results: response.data.items,
    total: response.data.count,
  }),
})

// Product detail endpoint
const getProduct = endpointAdapterFactory({
  endpoint: request => `${BASE_URL}/products/${request.id}`,
  httpClient: fetchHttpClient,
  responseMapper: response => response.data,
})

// Recommendations endpoint
const recommendations = endpointAdapterFactory({
  endpoint: `${BASE_URL}/recommendations`,
  httpClient: fetchHttpClient,
  requestMapper: request => ({
    productId: request.id,
    count: request.limit ?? 5,
  }),
  responseMapper: response => response.recommendations,
})

// Export as complete adapter
export const apiAdapter = {
  search,
  getProduct,
  recommendations,
}

// Usage
const searchResults = await apiAdapter.search({
  query: 'laptop',
  limit: 20,
})

const product = await apiAdapter.getProduct({ id: '123' })

const related = await apiAdapter.recommendations({
  id: '123',
  limit: 10,
})
```

## Advanced Patterns

### Shared Configuration

Create base configuration for multiple endpoints:

```typescript
const baseConfig = {
  httpClient: fetchHttpClient,
  defaultRequestOptions: {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    cancellable: true,
  },
}

const search = endpointAdapterFactory({
  ...baseConfig,
  endpoint: 'https://api.example.com/search',
})

const recommendations = endpointAdapterFactory({
  ...baseConfig,
  endpoint: 'https://api.example.com/recommendations',
})
```

### Error Handling

```typescript
const adapter = endpointAdapterFactory({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  responseMapper: response => {
    if (response.error) {
      throw new Error(`API Error: ${response.error.message}`)
    }
    return response.data
  },
})

// Handle errors
try {
  const results = await adapter({ query: 'shoes' })
} catch (error) {
  console.error('Search failed:', error)
}
```

### Middleware Pattern

Add request/response interceptors:

```typescript
const withLogging = (adapter) => async (request, options) => {
  console.log('Request:', request);
  const response = await adapter(request, options);
  console.log('Response:', response);
  return response;
};

const withRetry = (adapter, maxRetries = 3) => async (request, options) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await adapter(request, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * (i + 1));
    }
  }
};

const baseAdapter = endpointAdapterFactory({...});
const adapter = withRetry(withLogging(baseAdapter));
```

## Schema Mapper Deep Dive

### Basic Schema

```typescript
const schema = {
  // Direct mapping
  outputField: 'inputField',

  // Function transformation
  outputField: input => transform(input.field),

  // Constant value
  outputField: { $value: 'constant' },

  // Nested path
  outputField: 'nested.path.to.field',
}
```

### Array Mapping

```typescript
const schema = {
  items: {
    $path: 'data.results', // Path to array
    $subSchema: {
      // Schema for each item
      id: 'productId',
      name: 'title',
    },
  },
}
```

### Conditional Mapping

```typescript
const schema = {
  status: input => {
    if (input.active) return 'active'
    if (input.pending) return 'pending'
    return 'inactive'
  },
}
```

### Default Values

```typescript
const mapper = schemaMapperFactory(schema)

const mapWithDefaults = input => {
  const result = mapper(input)
  return {
    ...result,
    page: result.page ?? 1,
    limit: result.limit ?? 10,
  }
}
```

## Integration with X Components

When using with `@empathyco/x-components`:

```typescript
import { platformAdapter } from '@empathyco/x-adapter-platform'

const adapter = platformAdapter({
  endpoint: 'https://api.yourstore.com',
  // Mappers configured for Empathy Platform API
})

// Pass to X Components
app.use(installXPlugin, {
  adapter,
  store,
})
```

## TypeScript Best Practices

### Type-Safe Adapters

```typescript
import type { SearchRequest, SearchResponse } from '@empathyco/x-types'

const adapter = endpointAdapterFactory<SearchRequest, SearchResponse>({
  endpoint: 'https://api.example.com/search',
  httpClient: fetchHttpClient,
  requestMapper: (request: SearchRequest) => ({
    q: request.query,
    rows: request.rows,
  }),
  responseMapper: (response): SearchResponse => ({
    results: response.data.items,
    totalResults: response.data.count,
  }),
})

// Fully typed usage
const request: SearchRequest = { query: 'shoes', rows: 10 }
const response: SearchResponse = await adapter(request)
```

### Generic Adapter Factory

```typescript
function createApiAdapter<TRequest, TResponse>(
  endpoint: string,
  config: Partial<EndpointAdapterOptions<TRequest, TResponse>> = {},
) {
  return endpointAdapterFactory<TRequest, TResponse>({
    endpoint,
    httpClient: fetchHttpClient,
    ...config,
  })
}

const searchAdapter = createApiAdapter<SearchRequest, SearchResponse>('/search', {
  requestMapper: myMapper,
})
```

## Testing Adapters

```typescript
import { describe, expect, it, vi } from 'vitest'

describe('searchAdapter', () => {
  it('maps request correctly', async () => {
    const mockHttpClient = vi.fn().mockResolvedValue({
      data: { items: [], count: 0 },
    })

    const adapter = endpointAdapterFactory({
      endpoint: '/search',
      httpClient: mockHttpClient,
      requestMapper: req => ({ q: req.query }),
    })

    await adapter({ query: 'test' })

    expect(mockHttpClient).toHaveBeenCalledWith(
      '/search',
      expect.objectContaining({
        parameters: { q: 'test' },
      }),
    )
  })
})
```

## Common Issues

**CORS errors**: Configure backend to allow requests or use proxy

**Type errors**: Ensure request/response types match mappers

**Cancelled requests**: Check if `cancellable: true` and requests have same `id`

**Missing data**: Verify response mapper paths match API structure

**Timeout errors**: Increase timeout in `defaultRequestOptions`

## Related Packages

- **@empathyco/x-adapter-platform**: Pre-configured adapter for Empathy Platform API
- **@empathyco/x-types**: TypeScript type definitions for search domain
- **@empathyco/x-utils**: Shared utility functions
- **@empathyco/x-components**: Vue components that use adapters

## Documentation

- **GitHub**: https://github.com/empathyco/x/tree/main/packages/x-adapter
- **Empathy Docs**: https://docs.empathy.co/develop-empathy-platform/build-search-ui/
