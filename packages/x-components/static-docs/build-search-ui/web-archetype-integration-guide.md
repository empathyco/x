---
title: Integrate Interface X Archetype into an existing website
tags:
  - integration
  - archetype
  - archetype integration
  - x integration
  - interface x
  - x components
---

In this tutorial, you'll learn how to integrate the Interface&nbsp;X&nbsp;Archetype project in your
commerce store in a matter of minutes. You can use the X&nbsp;Archetype **as is** or you can
**[extend](web-archetype-development-guide.md)** the search and discovery interface experience to
meet your business needs.

To integrate the Interface&nbsp;X&nbsp;Archetype layer in your commerce store, just **load** the
generated Interface&nbsp;X JavaScript file and **initialize** it.

::: note IMPORTANT

If the X&nbsp;Archetype script is hosted by Empathy, all the X resources are provided by a CDN
through the following environment URLs:

- **Production**: `https://x.empathy.co/{INSTANCE}/app.js`
- **Staging**: `https://x.staging.empathy.co/{INSTANCE}/app.js`

Where `{INSTANCE}` is the name of your commerce store. If you require any assistance, contact
[Empathy Support](mailto:support@empathy.co).

:::

Depending on your business needs, Interface&nbsp;X supports two initialization types:

- **[Automatic initialization](#initializing-the-interface-x-project-automatically)**
- **[On-demand initialization](#initializing-the-interface-x-project-on-demand)**

::: develop Frameworks & libraries integration

You can integrate the X&nbsp;Archetype into any existing website regardless of the technology used
(i.e. **React**, **Vue**, **Svelte**, etc.), as the bundle includes all the dependencies you need
for a correct implementation.

:::

## Initializing the Interface X project automatically

Automatic initialization is the easiest way to integrate the Interface&nbsp;X project in a website.

**Steps to initialize the project automatically**

1. **Configure the JavaScript snippet** to define either an initialization object or a function.
2. **Load and initialize** the Interface&nbsp;X script.

### Configuring the snippet

First, add the JavaScript snippet configuration to define multiple initialization options, i.e. the
API to use, the language or currency to display, or even the tagging parameters to collect
search-related data to generate conversational search features and analytics.

Depending on whether you are retrieving **static or dynamic configuration values** in your
[snippet configuration](#snippet-configuration), you define an **object** or a **function** to
initialize Interface&nbsp;X:

- To retrieve **static** configuration values, define an initialization object as follows:

```js
window.initX = {
  instance: 'my-store',
  scope: 'desktop',
  lang: 'en',
  currency: 'EUR',
  consent: false
};
```

- To retrieve configuration values **dynamically**, use an initialization function:

```js
window.initX = function () {
  return {
    instance: 'my-store',
    env: location.href.includes('.pre.') ? 'staging' : undefined,
    scope: 'web',
    lang: localStorage.get('lang'),
    currency: localStorage.get('currency'),
    consent: localStorage.get('consent')
  };
};
```

::: note

You can change the snippet configuration values once the project is deployed. Use the
`/x-archetype/public/snippet-script.js` file to perform hot changes for the snippet parameters. For
more information on the supported parameters, check out
[Snippet configuration](#snippet-configuration).

:::

### Loading the script

Once the snippet configuration is ready, add the Interface&nbsp;X script to your webpage. The script
is hosted in a URL with the following syntax:

- **Production**: `https://x.empathy.co/{INSTANCE}/app.js`
- **Staging**: `https://x.staging.empathy.co/{INSTANCE}/app.js`

For example, to load the production version script for the instance _my-store_, you need to add the
following scripts to your HTML:

```html
<script>
  window.initX = {
    instance: 'my-store',
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false
  };
</script>
<script src="https://x.empathy.co/my-store/app.js" type="module"></script>
```

In the case you want to load the script for the staging environment, you just modify the script
attribute `src` so that it points to the staging environment as follows:

```html
<script>
  window.initX = {
    instance: 'my-store',
    env: 'staging', // By removing this param you would be using a production API with the staging version of Interface X
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false
  };
</script>
<script src="https://x.staging.empathy.co/my-store/app.js" type="module"></script>
```

Thus, when the Interface&nbsp;X JavaScript file is loaded, it retrieves the configuration from the
defined object or function.

## Initializing the Interface X project on demand

On-demand initialization allows you to control when Interface&nbsp;X is loaded.

**Steps to initialize the project on demand**

1. **Load** the Interface&nbsp;X script.
2. **Initialize** Interface&nbsp;X.

### Loading the script

Add the Interface&nbsp;X script hosted in a URL with the following syntax:

- **Production**: `https://x.empathy.co/{INSTANCE}/app.js`
- **Staging**: `https://x.staging.empathy.co/{INSTANCE}/app.js`

For example, to load the production version script for the instance _my-store_, you need to add the
following script to your HTML:

```html
<script src="https://x.empathy.co/my-store/app.js" type="module"></script>
```

In the case you want to load the script for the staging environment, you just modify the script
attribute `src` so that it points to the staging environment as follows:

```html
<script src="https://x.staging.empathy.co/my-store/app.js" type="module"></script>
```

### Initializing Interface&nbsp;X

Since no initialization configuration is defined when loading the script, you need to **invoke the
initialization function** created automatically in the
[X API](https://github.com/empathyco/x/blob/main/packages/x-components/src/x-installer/api/base-api.ts)
object to provide the initialization options:

```html
<script src="https://x.empathy.co/my-store/app.js" type="module"></script>
<script>
  window.InterfaceX.init({
    instance: 'my-store',
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false
  });
</script>
```

For this example, the initialization function is called immediately after loading the script, but it
can be called at any time. Note that you need to call this function only **once**.

::: interact

Check out the [X&nbsp;API](#x-api) section to learn more about the functions and parameters
supported.

:::

## Notes on X Archetype integration

To successfully integrate Interface&nbsp;X in your commerce store using the X&nbsp;Archetype, check
out further information about:

- **Initialization options** supported in [snippet configuration](#snippet-configuration)
- **[Callbacks and X&nbsp;event&nbsp;types](#callbacks-and-interface-x-events-types)** available to
  subscribe to when initializing
- **Functions supported by the [X&nbsp;API object](#x-api)** to initialize Interface&nbsp;X

### Snippet configuration

The
[snippet configuration](https://github.com/empathyco/x-archetype/blob/main/public/snippet-script.js)
allows you to configure multiple initialization options for the Interface&nbsp;X project such as
language, currency, and shopper's personal data consent. The snippet configuration supports the
following configuration parameters:

| Parameter                                              | Type                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `instance`                                             | `string`                                                                             | _Required._ ID of the API client instance. It's provided by Empathy.                                                                                                                                                                                                                                                                                                                    |
| `env`                                                  | `staging`                                                                            | _Optional_. API environment to use. Note that if you **do not** declare this parameter, you'll use the production API. Instead, use `env: 'staging'` to point to the staging API.                                                                                                                                                                                                       |
| `scope`                                                | `string`                                                                             | _Optional_. Context where the search interface is executed, i.e. `mobile`, `mobile-app`, `tablet`, `desktop`.                                                                                                                                                                                                                                                                           |
| `lang`                                                 | `string`                                                                             | _Required._ Language to use. By default, it's used for both the interface messages and the API requests.                                                                                                                                                                                                                                                                                |
| `uiLang`                                               | `string`                                                                             | _Optional_. Language to use for the interface messages **only**.                                                                                                                                                                                                                                                                                                                        |
| `consent`                                              | `boolean`                                                                            | _Required._ Determines whether the shopper has accepted the use of cookies so that the `sessionId` is sent to the Empathy's Search and Tagging APIs or not.                                                                                                                                                                                                                             |
| `documentDirection`                                    | `'ltr'` &#124; `'rtl'`                                                               | _Optional_. Writing direction script that the X Components should, i.e. left-to-right or right-to-left.                                                                                                                                                                                                                                                                                 |
| `currency`                                             | `string`                                                                             | _Required._ Currency identifier to configure how prices are displayed.                                                                                                                                                                                                                                                                                                                  |
| [`callbacks`](#callbacks-and-interface-x-events-types) | `Record<XEventName, (payload: XEventPayload<Event>, metadata: WireMetadata) => void` | _Optional_. Callback record where the _key_ is the event to listen and the _value_ is the callback to be executed whenever the event is emitted. E.g. to listen to the `UserAcceptedAQuery` event: `{ UserAcceptedAQuery({ eventPayload }) { console.log('UserAcceptedAQuery', eventPayload); }`                                                                                        |
| `isSpa`                                                | `boolean`                                                                            | _Optional_. Enables single-page application model. You set it to `true` when the X&nbsp;Archetype runs on top of a SPA website.                                                                                                                                                                                                                                                         |
| `filters`                                              | `string[]`                                                                           | _Optional_. Filters to be applied at the start of the application and start to searching with those filters selected.                                                                                                                                                                                                                                                                   |
| `queriesPreview`                                       | `QueryPreviewInfo[]`                                                                 | _Optional_. Each query will add a preview of results at the pre-search step before any query is typed in the search box, e.g. To preview two queries, one with results for `backpacks` and another one with `watches`: `[{query: "backpack", title: "Back to school"}, {query: "watch", title: "Get on time"}]` [See further information](#setting-up-the-queries-preview-dynamically). |
| `<extra parameters>`                                   | `any`                                                                                | _Optional_. Any other parameters to sent to the API calls directly. E.g. to filter the search catalogue with a warehouse parameter, you add `warehouse: <your-warehouse-identifier>` to the snippet configuration.                                                                                                                                                                      |

::: note Consent parameter

When the `consent` parameter is set to `false`, the `sessionId` is not generated nor sent to the
Tagging API. Only shoppers' behavioral data (wisdom of the crowd) is inferred from the current
session. The `consent` parameter is set to `true` as soon as the shopper accepts the use of cookies.
If page reload is not triggered after accepting cookies, update the `consent` parameter
(`window.initX.consent = true`) to start tracking the current session.

 </br>

Although cookie acceptance is bound to the generation of the `sessionID` in local storage, Empathy
does **not use any cookies** in its libraries.

:::

### Callbacks and Interface X events types

You can use a **callback** to subscribe to specific **X&nbsp;events&nbsp;types** to perform
particular actions when triggered.

For example, you subscribe to the `UserClickedResultAddToCart` event to add a product result to the
shopping cart:

```html
<script src="https://x.empathy.co/my-store/app.js" type="module"></script>
<script>
  window.InterfaceX.init({
    instance: 'my-store',
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false,
    callbacks: {
      UserAcceptedAQuery: query => {
        doSomethingInWebApp(query);
      },
      UserClickedResultAddToCart: result => {
        addToCartInWebApp(result);
      }
    }
  });
</script>
```

Interface&nbsp;X is built on an [event-based architecture](web-x-architecture.md). There are more
than one hundred of events available to subscribe to via callbacks to trigger different actions in
your app. Check out the complete
**[X&nbsp;events types list](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)**
in the open source repository in GitHub.

X&nbsp;events types can be triggered from different modules in the X&nbsp;Components project.
However, every module has its own sort of components (e.g. Empathize X events, Search Box X events,
etc.). See the corresponding `events.types.ts` file for each module in the
[X&nbsp;Components library in GitHub](https://github.com/empathyco/x/tree/main/packages/x-components/src/x-modules).

### X API

The
[X&nbsp;API](https://github.com/empathyco/x/blob/main/packages/x-components/src/x-installer/api/base-api.ts)
object allows your commerce store to communicate with Interface&nbsp;X. It supports multiple
functions to integrate Interface&nbsp;X in your website. You can access these functions inside the
`window.InterfaceX` object.

| Function           | Parameters                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `init`             | [snippet configuration params](#snippet-configuration) - _Required_. Initialization options | [Initializes Interface&nbsp;X on demand](#initializing-interface-x-project-on-demand).                                                                                                                                                                                                                                                                                                                                                                       |
| `search`           | `query` - _Optional_. Query to open Interface&nbsp;X                                        | Executes Interface&nbsp;X and triggers a search with the given query.                                                                                                                                                                                                                                                                                                                                                                                        |
| `setSnippetConfig` | [snippet configuration params](#snippet-configuration) - _Required_. Initialization options | Changes initialization options so that all components react to the changes, i.e. changing both search engine and language without reloading the page.                                                                                                                                                                                                                                                                                                        |
| `addProductToCart` | `productId` - _Optional._ Id of the product added to cart                                   | Sends tracking of the `AddToCart` event to the [Empathy Tagging microservice](https://docs.empathy.co/develop-empathy-platform/capture-interaction-signals/tagging-api-guide.html) for the product displayed on screen. This function is called from the product detail page (PDP) when the shopper clicks on the add-to-cart button. If the `productId` is not provided, the URL detects whether the shopper found the product via a search session or not. |

### Setting up the queries preview dynamically

The `queriesPreview` parameter can be changed according to your commerce store convenience. You can
take advantage of `setSnippetConfig` to adjust the queries depending on the section the user
currently is, or any other configuration you want. For example, to show different queries for the
kids and the adult section:

```html
<script>
    if (yourCommerceStoreEnvironment.section === 'kids') {
      InterfaceX.setSnippetConfig({
        queriesPreview: [
          {
            query: "backpack",
            title: "Back to School!",
          },
          {
            query: "pencil",
            title: "Write with style!",
          }
        ]
      })
    } else if (yourCommerceStoreEnvironment.section === 'adult') {
      InterfaceX.setSnippetConfig({
        queriesPreview: [
          {
            query: "watch",
            title: "Get on time!",
          }
        ]
      })
    }
</script
```
