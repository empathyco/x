# x-adapter

**Empathy Adapter** is a library of utils to ease the communication with any API.

Some features that it provides:

- Create an API request function based on a simple configuration.
- Allow to configure several endpoints by extending the initial configuration.
- Allow to configure the response/request mapping.
- Create mapping functions based on Schemas.

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

The `adapter` is a function that triggers a request with the given data (a search request and an
options object to make the request with). It returns a response promise that you will use to curate
the data you need. You will only need to call this function to get you request made, as you would do
with any `HTTP` client.

```ts
async searchOnClick() {
  const response = await searchProducts({ query: 'phone' });
  this.items = response.products;
}
```

<br>

### Implement your own adapter

To create an `EndpointAdapter` you can use the `endpointAdapterFactory` options. This function will
receive an `EndpointAdapterOptions` object containing all the needed data to perform and map a
request, and return a function that when invoked will trigger the request. The options that can be
configured are:

- `endpoint`: The url that for the request. Can be either a string or a mapper function that
  receives the request and returns a string.
- `httpClient`: A function that will receive the endpoint and request options such as the parameters
  and will perform the request, returning a promise with the response.
- `defaultRequestOptions`: Some options to configure how the request will behave by default, like if
  it is cancelable, a unique id to identify it, if it should use the body to send the params...
- `requestMapper`: A function to apply to the request parameters and transform them.
- `responseMapper`: A function to apply to the response and transform it.

<br>

#### Basic adapter implementation

In this example we have a simple request mapper that will add a `query` parameter to the endpoint's
url to perform the request. If you check the function call above, you will see the query parameter
passed.

###### Types definition

```ts
// Param needed to perform the request to the API
interface ApiRequest {
  q?: string;
  id?: number;
}

// API response data models
interface ApiSearchResponse {
  products: ApiProduct[];
  total: number;
}
interface ApiProduct {
  id: number;
  title: string;
  price: number;
}

// Param passed to the adapter function that will be mapped
interface MySearchRequest {
  query: string;
}

// App's data models
interface MySearchResponse {
  products: MyProduct[];
  total: number;
}
interface MyProduct {
  id: string;
  name: string;
  price: number;
}
```

###### Adapter's factory function implementation

```ts
export const searchProducts = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/products/search',
  requestMapper({ query }: Readonly<MySearchRequest>): ApiRequest {
    return {
      q: query // the request will be triggered as https://dummyjson.com/products/search?q=phone
    };
  },
  responseMapper({ products, total }: Readonly<ApiSearchResponse>): MySearchResponse {
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
```

<br>

#### Using a dynamic endpoint

You can use a mapper function to do so and pass the dynamic part of the url as a parameter when the
adapter function is called.

```ts
export const getProductById = endpointAdapterFactory({
  endpoint: ({ id }: GetProductByIdRequest) => 'https://dummyjson.com/products/' + id,
  responseMapper(response: Readonly<ApiProduct>): MyProduct {
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
  endpoint: 'https://dummyjson.com/{section}/{id}',
  // ... rest of options to configure
  }
});

// You would pass the parameter's value in the function call
getItemById({ section: "products", id: 1 });
getItemById({ section: "quotes", id: 3 });
```

Additionally, you can also overwrite your adapter's endpoint definition using the
`RequestOptions.endpoint` parameter in the function call. Take in account that your `responseMapper`
definition should be agnostic enough to support the change:

```ts
export const getItemById = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/quotes/{id}',
  // ... rest of options to configure
  }
});

// You would pass the new endpoint in the function call
getItemById({ id: 1 }, { endpoint: 'https://dummyjson.com/products/{id}');
```

<br>

#### Using the httpClient function

The `x-adapter` uses the `Fetch API` interface by default to perform the requests. But you can use
your own HTTP Client as part of the configurable `EndpointAdapterOptions`. The `httpClient` is a
function type that accepts two parameters: the `endpoint` and an additional
[`options`](https://github.com/empathyco/x/blob/main/packages/x-adapter/src/http-clients/types.ts)
object to make the request with.

```ts
// HTTP Client
const customHttpClient: HttpClient = (endpoint, options) =>
  axios.get(endpoint, { params: options?.parameters }).then(response => response.data);

// Request Mapper
const customRequestMapper: Mapper<MySearchRequest, ApiRequest> = ({ query }) => {
  return {
    q: query
  };
};

// Object Mapper to use in the Response Mapper
const productMap = (product: ApiProduct): MyProduct => {
  return {
    id: product.id.toString(),
    name: product.title,
    price: product.price
  };
};

// Response Mapper
const customResponseMapper: Mapper<ApiSearchResponse, MySearchResponse> = ({ products, total }) => {
  return {
    products: products.map(product => productMap(product)),
    total: total
  };
};

// Adapter factory function implementation
export const searchProducts = endpointAdapterFactory({
  endpoint: 'https://dummyjson.com/products/search',
  httpClient: customHttpClient,
  requestMapper: customRequestMapper,
  responseMapper: customResponseMapper
});
```

<br>

### Implement your own adapter using schemas

The `x-adapter` library includes a `schemaMapperFactory` function that returns a mapper function to
execute the `schema` you provide. The function accepts a `Source` object (the data to be
transformed) and a `Target` object. You just need to create the request and response models to
define the structure of your data vs the APIs data, and pass them to the factory function.

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

// Your App's data models
interface UserRequest {
  query: string;
}
interface UserResponse {
  people: MyUser[];
  total: number;
}
interface MyUser {
  id: string;
  name: string;
}
```

###### Schema's mapper factory function implementation

```ts
// Map both the request and the response to connect your model with the API you are working with.
const userSearchRequestMapper = schemaMapperFactory<UserRequest, ApiUserRequest>({
  q: 'query'
});
const userSearchResponseMapper = schemaMapperFactory<ApiUserResponse, UserResponse>({
  people: ({ users }) =>
    users.map(user => {
      return {
        // you may use paths to access to an inner property if needed
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

###### Basic subSchema implementation

```ts
// TO DO: example of using a subSchema to map a response
```

###### Reusing the same Schema under different paths

```ts
// TO DO: example reusing the same schema under different paths in two adapters.
```

<br>

#### Using a mutable schema

With the `x-adapter` you can create mutable schemas. These schemas are helpful when writing
libraries where you want to have some defaults, but allow to modify or extend them.

```
// TODO: Add mutable schema's options: replace, override, delete
```

```ts
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
// TODO: add introduction & test's location
```

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
