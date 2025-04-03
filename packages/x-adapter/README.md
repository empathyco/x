# x-adapter

**Empathy Adapter** is a library of utils to ease the communication with any API.

Some features that it provides:

- Create an API request function based on a simple configuration.
- Allow to configure several endpoints by extending the initial configuration.
- Allow to configure the response/request mapping.
- Create mapping functions based on Schemas.

<br>

## Tech Stack

[![TypeScript](https://img.shields.io/badge/-typescript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/-jest-C21325?logo=jest&logoColor=white&style=for-the-badge)](https://jestjs.io/)

<br>

## Installation

```
# or pnpm or yarn
npm install @empathyco/x-adapter
```

If you use this package together with
[x-components](https://github.com/empathyco/x/tree/main/packages/x-components), you should
additionally install the
[@empathyco/x-types](https://github.com/empathyco/x/tree/main/packages/search-types) package and
take the advantage of it in your project development.

<br>

## Configuration & Usage

An `API Adapter` is a collection of `EndpointAdapters`, one for each endpoint of the API you want to
consume. Each `EndpointAdapter` is an asynchronous function that performs a request with the given
data, and returns a response promise with the requested data. Internally, it usually has to
transform the request data so the API can understand it, and the response data so your app
understands it as well.

<br>

### Implement your own adapter

To create an `EndpointAdapter` you can use the `endpointAdapterFactory` function. This function will
receive an `EndpointAdapterOptions` object containing all the needed data to perform and map a
request, and return a function that when invoked will trigger the request. The options that can be
configured are:

- `endpoint`: The URL that the `httpClient` uses. It can be either a string or a mapper function
  that dynamically generates the URL string using the request data.
- `httpClient`: A function that will receive the endpoint and request options such as the parameters
  and will perform the request, returning a promise with the unprocessed response data.
- `defaultRequestOptions`: Default values for the endpoint configuration. You can use it to define
  if a request is cancelable, a unique id to identify it, anything but the `endpoint` can be set.
  Check
  [EndpointAdapterOptions](https://github.com/empathyco/x/blob/main/packages/x-adapter/src/endpoint-adapter/types.ts)
  to see the available options.
- `requestMapper`: A function to transform the unprocessed request into parameters the API can
  understand.
- `responseMapper`: A function to transform the API response into data that your project can
  understand.

<br>

#### Basic adapter implementation

In this example we have a simple request mapper that will add a `q` parameter to the endpoint's url
to perform the request. If you check the function call below, you will see the query parameter
passed.

###### Types definition

```ts
// API models
interface ApiRequest {
  q?: string;
  id?: number;
}
interface ApiSearchResponse {
  products: ApiProduct[];
  total: number;
}
interface ApiProduct {
  id: number;
  title: string;
  price: number;
}

// App models
interface AppSearchRequest {
  query: string;
}
interface AppSearchResponse {
  products: AppProduct[];
  total: number;
}
interface AppProduct {
  id: string;
  name: string;
  price: number;
}
```

###### Adapter's factory function implementation

```ts
import { endpointAdapterFactory } from '@empathyco/x-adapter';

export const searchProducts = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/products/search',
  requestMapper({ query }: Readonly<AppSearchRequest>): ApiRequest {
    return {
      q: query // the request will be triggered as https://dummyjson.com/products/search?q=phone
    };
  },
  responseMapper({ products, total }: Readonly<ApiSearchResponse>): AppSearchResponse {
    return {
      products: products.map(product => {
        return {
          id: product.id.toString(),
          name: product.title,
          price: product.price
        };
      }),
      total
    };
  }
});

// Function call
async function searchOnClick() {
  const response = await searchProducts({ query: 'phone' });
  console.log('products', response.products);
}
```

<br>

#### Using a dynamic endpoint

If you need to generate an endpoint url dynamically, you can add parameters inside curly brackets to
the endpoint string. By default, these parameters will be replaced using the request data. If a
parameter is not found inside the request, an empty string will be used.

```ts
export const getItemById = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/{section}/{id}'
  // ... rest of options to configure
});
getItemById({ section: 'products', id: 1 }); // 'https://dummyjson.com/products/1'
getItemById({ section: 'quotes', id: 3 }); // 'https://dummyjson.com/quotes/3'
getItemById({ section: 'quotes' }); // 'https://dummyjson.com/quotes/'
```

For more complex use cases, you can use a mapper function. This function receives the request, and
must return the URL string.

```ts
export const getProductById = endpointAdapterFactory({
  endpoint: ({ id }: GetProductByIdRequest) => `https://dummyjson.com/products/${  id}`
  // ... rest of options to configure
});
```

Additionally, you can also overwrite your adapter's endpoint definition using the
`RequestOptions.endpoint` parameter in the function call. Take into account that your
`responseMapper` definition should be agnostic enough to support the change:

```ts
export const getItemById = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/quotes/{id}',
  // ... rest of options to configure
});

// You would pass the new endpoint in the function call
getItemById({ id: 1 }, { endpoint: 'https://dummyjson.com/products/{id}'});
```

<br>

#### Using the httpClient function

Every adapter created using `endpointAdapterFactory` uses the `Fetch API` by default to perform the
requests. But you can use your own `HttpClient` as part of the configurable
`EndpointAdapterOptions`. A `HttpClient` is a function that accepts two parameters: the `endpoint`
string, and an additional
[`options`](https://github.com/empathyco/x/blob/main/packages/x-adapter/src/http-clients/types.ts)
object to make the request with.

```ts
// HTTP Client
const axiosHttpClient: HttpClient = (endpoint, options) =>
  axios.get(endpoint, { params: options?.parameters }).then(response => response.data);

// Request Mapper
const customRequestMapper: Mapper<AppSearchRequest, ApiRequest> = ({ query }) => {
  return {
    q: query
  };
};

// Response Mapper
const customResponseMapper: Mapper<ApiSearchResponse, AppSearchResponse> = ({
  products,
  total
}) => {
  return {
    products: products.map(product => {
      return {
        id: product.id.toString(),
        name: product.title,
        price: product.price
      };
    }),
    total
  };
};

// Adapter factory function implementation
export const searchProducts = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/products/search',
  httpClient: axiosHttpClient,
  requestMapper: customRequestMapper,
  responseMapper: customResponseMapper
});
```

<br>

### Implement your own adapter using schemas

Sometimes the transformations you will need to do in the mappers are just renaming parameters. What
the API calls `q` might be called `query` in your request. To ease this transformations,
`@empathyco/x-adapter` allows to create mappers using schemas.

A schema is just a dictionary where the key is the desired parameter name, and the value is the path
of the source object that has the desired value or a simple mapper function if you need to transform
the value somehow.

###### Types definition

```ts
// API models
interface ApiUserRequest {
  q: string;
}
interface ApiUserResponse {
  users: ApiUser[];
  total: number;
}
interface ApiUser {
  id: number;
  firstName: string;
}

// App models
interface AppUserRequest {
  query: string;
}
interface AppUserResponse {
  people: AppUser[];
  total: number;
}
interface AppUser {
  id: string;
  name: string;
}
```

###### Schema's mapper factory function implementation

```ts
// Map both the request and the response to connect your model with the API you are working with.
const userSearchRequestMapper = schemaMapperFactory<AppUserRequest, ApiUserRequest>({
  q: 'query'
});
const userSearchResponseMapper = schemaMapperFactory<ApiUserResponse, AppUserResponse>({
  people: ({ users }) =>
    users.map(user => {
      return {
        id: user.id.toString(),
        name: user.firstName
      };
    }),
  total: 'total'
});

// Use the mappers in the Endpoint's adapter factory function
export const searchUsers = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/users/search',
  requestMapper: userSearchRequestMapper,
  responseMapper: userSearchResponseMapper
});
```

<br>

#### Create more complex models with SubSchemas

When you are creating adapters for different APIs you might find the case that you have to map the
same model in different places. To help you with that, schemas allows to use `SubSchemas`. To use
them you just have to provide with the `Path` of the data to map, and the `Schema` to apply to it.

###### Types definition

```ts
// API models
interface ApiRequest {
  q: string;
}
interface ApiResponse {
  users: ApiUser[];
  total: number;
}
interface ApiUser {
  id: number;
  email: string;
  phone: string;
  address: ApiAddress;
  company: ApiAddress;
}
interface ApiAddress {
  address: string;
  city: string;
  postalCode: string;
}

// App models
interface AppRequest {
  query: string;
}
interface AppResponse {
  people: AppUser[];
  count: number;
}
interface AppUser {
  id: number;
  contact: {
    email: string;
    phone: string;
    homeAddress: AppAddress;
    companyAddress: AppAddress;
  };
}
interface AppAddress {
  displayName: string;
  postalCode: number;
  city: string;
}
```

###### Schemas and SubSchemas implementation

```ts
// Address Schema definition
const addressSchema: Schema<ApiAddress, AppUserAddress> = {
  displayName: source => `${source.address}, ${source.postalCode} - ${source.city}`,
  city: 'city',
  postalCode: source => Number.parseInt(source.postalCode)
};

// User Schema definition with a subSchema
const userSchema: Schema<ApiUser, AppUser> = {
  id: 'id',
  contact: {
    email: source => source.email.toLowerCase(),
    phone: 'phone',
    homeAddress: {
      $subSchema: addressSchema,
      $path: 'address'
    },
    companyAddress: {
      $subSchema: addressSchema,
      $path: 'address'
    }
  }
};
```

###### Schema's mapper factory function implementation with subSchemas

```ts
// Response mapper with user's subSchema implemented
const responseMapper = schemaMapperFactory<ApiSearchUsersResponse, AppSearchUsersResponse>({
  people: {
    $subSchema: userSchema,
    $path: 'users'
  },
  count: 'total'
});

const requestMapper = schemaMapperFactory<SearchUsersRequest, ApiSearchUsersRequest>({
  q: 'query'
});

// Endpoint Adapter Factory function implementation
export const searchUsersWithContactInfo = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/users/search',
  requestMapper,
  responseMapper
});
```

<br>

#### Using a mutable schema

This feature lets you have some default schemas, and modify or extend them for some concrete
implementations. To do so, you can use the `createMutableSchema` function, passing a `Source` and
`Target` type parameters to map your models. This function will return a `MutableSchema` that apart
from the mapping information will also contain some methods to create new schemas or modify the
current one.

In the example below we will create a `MutableSchema` to have a default object that will be reused
for different endpoint calls.

###### Types definition and MutableSchema

```ts
// API models
export interface ApiBaseObject {
  id: number;
  body: string;
}

// APP models
export interface AppBaseObject {
  id: string;
  text: string;
}

// Mutable Schema
export const baseObjectSchema = createMutableSchema<ApiBaseObject, AppBaseObject>({
  id: ({ id }) => id.toString(),
  text: 'body'
});
```

Once we have the `MutableSchema`, we can use the following methods to fit our different APIs needs:

- `$extends`: Creates a new `MutableSchema` based on the original one. The original remains
  unchanged. This can be useful if we need to create a new `EndpointAdapter` with models based on
  another API.
- `$override`: Merges/modifies the original `MutableSchema` partially, so the change will affect to
  all the `EndpointAdapter`(s) that are using it. It can be used to change the structure of our
  request/response mappers, or to add them new fields. Useful for clients with few differences in
  their APIs. For example, you can create a library with a default adapter and use this library from
  the customer projects overriding only the needed field (e.g. retrieve the images from `pictures`
  instead of `images` in a products API).
- `$replace`: Replaces completely the original `MutableSchema` by a new one, it won't exist anymore.
  The change will affect to all the `EndpointAdapter`(s) that were using it. Useful for clients with
  a completely different API/response to the standard you have been working with.

###### Extend a MutableSchema to reuse it in two different endpoints with more fields

```ts
import { ApiBaseObject, AppBaseObject, baseObjectSchema } from '@/base-types';

// Api models
interface ApiPost extends ApiBaseObject {
  title: string;
}
interface ApiPostsResponse {
  posts: ApiPost[];
}

interface ApiComment extends ApiBaseObject {
  postId: number;
}
interface ApiCommentsResponse {
  comments: ApiComment[];
}

// App models
interface AppPost extends AppBaseObject {
  postTitle: string;
}
interface AppPostsResponse {
  posts: AppPost[];
}

interface AppComment extends AppBaseObject {
  postId: number;
}
interface AppCommentsResponse {
  comments: AppComment[];
}

// Extend for posts endpoint
const postSchema = baseObjectSchema.$extends<ApiPost, AppPost>({
  postTitle: 'title'
});

const postsResponse = schemaMapperFactory<ApiPostsResponse, AppPostsResponse>({
  posts: {
    $subSchema: postSchema,
    $path: 'posts'
  }
});

export const searchPosts = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/posts',
  responseMapper: postsResponse
});

// Extend for comments endpoint
const commentSchema = baseObjectSchema.$extends<ApiComment, AppComment>({
  postId: 'postId'
});

const commentsResponse = schemaMapperFactory<ApiCommentsResponse, AppCommentsResponse>({
  comments: {
    $subSchema: commentSchema,
    $path: 'comments'
  }
});

export const searchComments = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/comments',
  responseMapper: commentsResponse
});
```

###### Override a MutableSchema to add more fields

As said above, the suitable context for using the `override` method would be a project with an API
that doesn't differ too much against the one used in our "base project". That means we can reuse
most of the types and schemas definitions, so we would only add a few new fields from the new API.

```ts
import { ApiBaseObject, AppBaseObject, baseObjectSchema } from '@/base-types';

// Api models
interface ApiTodo {
  completed: boolean;
  todo: string;
  userId: number;
}

interface ApiTodosResponse {
  todos: ApiBaseObject[];
}

// App models
interface AppTodo {
  completed: boolean;
  text: string;
  userId: string;
}

interface AppTodosResponse {
  todos: AppBaseObject[];
}

// Response mapper
const todosResponse = schemaMapperFactory<ApiTodosResponse, AppTodosResponse>({
  todos: {
    $subSchema: baseObjectSchema,
    $path: 'todos'
  }
});

// Endpoint Adapter
export const searchTodos = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/todos',
  responseMapper: todosResponse
});

// Override the original Schema. The Schema changes to map: 'id', 'completed', 'text' and 'userId''
baseObjectSchema.$override<ApiTodo, AppTodo>({
  completed: 'completed',
  text: 'todo',
  userId: ({ userId }) => userId.toString()
});
```

###### Replace a MutableSchema to completely change it

In this case we are facing too many differences between API responses. We don't need to write a
whole adapter from scratch, as there are other parts of the API that aren't changing so much, but we
should replace some `endpointAdapter`'s schemas.

```ts
import { ApiBaseObject, AppBaseObject, baseObjectSchema } from '@/base-types';

// Api models
interface ApiQuote {
  id: number;
  quote: string;
  author: string;
}

interface ApiQuotesResponse {
  quotes: ApiBaseObject[];
}

// App models
interface AppQuote {
  quoteId: string;
  quote: string;
  author: string;
}

interface AppQuotesResponse {
  quotes: AppBaseObject[];
}

// Response mapper
const quotesResponse = schemaMapperFactory<ApiQuotesResponse, AppQuotesResponse>({
  quotes: {
    $subSchema: baseObjectSchema,
    $path: 'quotes'
  }
});

// Endpoint Adapter
export const searchQuotes = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/quotes',
  responseMapper: quotesResponse
});

// Replace the original Schema
baseObjectSchema.$replace<ApiQuote, AppQuote>({
  quoteId: ({ id }) => id.toString(),
  quote: 'quote',
  author: 'author'
});
```

<br>

### Extend an adapter that uses schemas

Imagine you have a new setup and that you can reuse most of the stuff you have developed. Probably
you have built an adapter instance as a configuration object that contains all of your
`EndpointAdapter` calls, so you only need to extend the endpoint you need to change.

```ts
export const adapter = {
  searchItem: getItemById,
  searchList: searchComments
  // Any endpoint adapter you are using to communicate with your API
};

adapter.searchList = searchComments.extends({
  endpoint: 'https://dummyjson.com/comments/',
  defaultRequestOptions: {
    // If you need to send an id, a header...
  },
  defaultRequestOptions: {
    parameters: {
      limit: 10,
      skip: 10
    }
  }
});
```

For further detail, you can check the
[x-platform-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter-platform) package.
It is a whole adapter implementation using this `x-adapter` library to suit the
[Search Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html)
needs.

## Test

**Empathy Adapter** features are tested using [Jest](https://jestjs.io/). You will find a
`__tests__` folder inside each of the project's sections.

```
npm run test
```

## Changelog

[Changelog summary](https://github.com/empathyco/x/blob/main/packages/x-adapter/CHANGELOG.md)

## Contributing

To start contributing to the project, please take a look at our
**[Contributing Guide](https://github.com/empathyco/x/blob/main/.github/CONTRIBUTING.md).** Take in
account that `x-adapter` is developed using [Typescript](https://www.typescriptlang.org/), so we
recommend you to check it out.

## License

[empathyco/x License](https://github.com/empathyco/x/blob/main/packages/x-adapter/LICENSE)
