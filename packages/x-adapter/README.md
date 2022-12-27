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
npm i @empathyco/x-adapter
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
// API data models
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

// App's data models
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
      total: total
    };
  }
});

// Function call
async function searchOnClick() {
  const response = await searchProducts({ query: 'phone' });
  this.items = response.products;
}
```

<br>

#### Using a dynamic endpoint

You can use a mapper function to do so and pass the dynamic part of the url as a parameter when the
adapter function is called.

```ts
export const getProductById = endpointAdapterFactory({
  endpoint: ({ id }: GetProductByIdRequest) => 'https://dummyjson.com/products/' + id,
  responseMapper(response: Readonly<ApiProduct>): AppProduct {
    return productMap(response);
  }
});
```

Or you can place your parameter(s) inside curly brackets, and they will be added to the final
string, thanks to the
[interpolate](https://github.com/empathyco/x/blob/main/packages/x-adapter/src/utils/interpolate.ts)
utility function. If a value is not provided, its parameter would just will be removed from the
string.

```ts
export const getItemById = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/{section}/{id}'
  // ... rest of options to configure
});

// You would pass the parameter's value in the function call
getItemById({ section: 'products', id: 1 });
getItemById({ section: 'quotes', id: 3 });
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
getItemById({ id: 1 }, { endpoint: 'https://dummyjson.com/products/{id}');
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
    total: total
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
// API data models
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

// App's data models
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
// API data models
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

// APP data models
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
  postalCode: source => parseInt(source.postalCode)
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

This feature lets you have some default mappers, and modify or extend them for some concrete
implementations. To do so, you should use the `createMutableSchema` helper function, and pass as a
parameter the schema you want to make mutable.

```ts
// TODO: Creating a mutable schema
```

Once you have your mutable schema, you can use its available methods to obtain a new schema based on
it:

- `replace`: Replaces completely the original Schema.
- `override`: Merges the original schema with the new one.
- `extends`: Creates a new Schema based on the original Schema. The original remains unchanged.

```ts
// TODO: Use mutable schema's methods: '$replace', '$override', '$extends'
```

<br>

### Extend an adapter that uses schemas

You can check the
[x-platform-adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter-platform) library.
You will find a sample implementation of the `x-adapter` library based on the
[Search Platform API](https://docs.empathy.co/develop-empathy-platform/api-reference/search-api.html),
and also some guidance on how to extend it for your needs.

## Test

**Empathy Adapter** features are tested using [Jest](https://jestjs.io/). You will find a
`__tests__` folder inside each of the project's sections.

```
npm test
```

## Changelog

[Changelog summary](https://github.com/empathyco/x/blob/main/packages/x-adapter/CHANGELOG.md)

## Contributing

To start contributing to the project, please take a look to
our **[Contributing Guide](https://github.com/empathyco/x/blob/main/.github/CONTRIBUTING.md).** Take
in account that `x-adapter` is developed using [Typescript](https://www.typescriptlang.org/), so we
recommend you check it out.

## License

[empathyco/x License](https://github.com/empathyco/x/blob/main/packages/x-adapter/LICENSE)
