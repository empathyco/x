---
title: Integrate Interface X Archetype into an existing website
tags:
  - integration
  - archetype
  - X Components archetype integration
  - x integration
  - interface x
  - x components
  - archetype integration
---

# Integrate Interface X Archetype into an existing website

Once you have finished developing or extending your search interface using the
Interface&nbsp;X&nbsp;Archetype project you will probably want to integrate it into your current
store.

The integration is a 2-steps process:

- Load Interface&nbsp;X script.
- Initialise the Interface&nbsp;X.

Depending on your business needs, there are 2 different ways of making this integration process:
auto initialising, or initialising on demand.

## Auto initialisation

This is the easiest way to integrate the Interface&nbsp;X project in a website. The way to do so is
by first defining an initialisation object or function, and then loading the Interface&nbsp;X
script.

### 1. Add a snippet configuration

The snippet configuration is needed by Interface&nbsp;X to know the API it must use, the language or
currency it should display the texts in, or tagging parameters to enrich the data and provide better
insights on how users search.

If your configuration values are easy to retrieve or static, you can simply use an object.

```js
window.initX = {
  instance: 'my-store',
  env: 'live',
  scope: 'desktop',
  lang: 'en',
  currency: 'EUR',
  consent: false
};
```

Otherwise, if you need to retrieve values dynamically, or execute any kind of logic before the
initialisation you can also use a function:

```js
window.initX = function () {
  return {
    instance: 'my-store',
    env: location.href.includes('.pre.') ? 'staging' : 'live',
    scope: 'web',
    lang: localStorage.get('lang'),
    currency: localStorage.get('currency'),
    consent: localStorage.get('consent')
  };
};
```

You can read more about the [Snippet Configuration](#snippet-configuration) below.

### 2. Load the Interface&nbsp;X script

Once you have defined your snippet configuration either as an object or a function, you can insert
the Interface&nbsp;X script. This script is hosted in a URL of this shape
`https://x.<environment?>.empathy.co/<instance>/app.js`.

For example, supposing that `my-store` is the instance, and you want to load the production script,
you can add to your HTML the following scripts.

```html
<script>
  window.initX = {
    instance: 'my-store',
    env: 'live',
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false
  };
</script>
<script src="https://x.empathy.co/my-store/app.js"></script>
```

Or if you want to load the staging version, you just have to change the script `src` attribute to
point to the staging environment:

```html
<script>
  window.initX = {
    instance: 'my-store',
    env: 'live', // Note that here you are using production API with the staging version of Interface X
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false
  };
</script>
<script src="https://x.staging.empathy.co/my-store/app.js"></script>
```

This way, when the Interface&nbsp;X JavaScript file is loaded, it will retrieve the configuration
from the object or function that you defined before. Nothing else is required.

## Initialise on demand

If you want to have more manual control on when the Interface&nbsp;X is loaded, you can still do so.
Instead of defining an initialisation object or function upfront like in
[Auto initialisation](#auto-initialisation), you can invoke a function with these options that will
initialise Interface&nbsp;X.

### 1. Load the Interface&nbsp;X script

First, load the Interface&nbsp;X script. As you may already know, it is hosted in a URL of this
shape: `https://x.<environment?>.empathy.co/<instance>/app.js`.

For example, supposing that `my-store` is the instance, and you want to load the production script,
you can add to your HTML the following scripts:

```html
<script src="https://x.empathy.co/my-store/app.js"></script>
```

For loading the staging version simply change the `src` attribute to the staging environment:

```html
<script src="https://x.staging.empathy.co/my-store/app.js"></script>
```

### 2. Initialise Interface&nbsp;X

Loading the Interface&nbsp;X script and not providing a `initX` configuration will make it create an
initialisation function in the [X API](#x-api) object that you can invoke whenever you want. In this
example we are calling it immediately after loading the Interface&nbsp;X script, but it can be
invoked at any time. Note that you should only call this function **once**.

```html
<script src="https://x.empathy.co/my-store/app.js"></script>
<script>
  window.X.init({
    instance: 'my-store',
    env: 'live',
    scope: 'desktop',
    lang: 'en',
    currency: 'EUR',
    consent: false
  });
</script>
```

## Snippet configuration

The snippet configuration allows you to configure certain parts of the Interface&nbsp;X project like
language, the currency, inform whether the user has given us his consent to process personal data.

| Name                  | Type                                                                                 | Required | Description                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------ | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| instance              | `string`                                                                             |    ✅    | The identifier of the API client instance. Should be provided by Empathy                                                                                                                                                                                                                        |
| env                   | `'live'` &#124; `'staging'`                                                          |          | The API environment to use. Note that you can use the production version of your Interface&nbsp;X with the staging API, or viceversa.                                                                                                                                                           |
| scope                 | `string`                                                                             |          | The context name where the search interface is being executed. I.e. `mobile`, `mobile-app`, `tablet`, `desktop`                                                                                                                                                                                 |
| lang                  | `string`                                                                             |    ✅    | The language to use. By default this lang is used for both the front-end and the API requests                                                                                                                                                                                                   |
| searchLang            | `string`                                                                             |          | A language to use only for the API requests                                                                                                                                                                                                                                                     |
| consent               | `boolean`                                                                            |    ✅    | Whether the user has allowed to process its personal data or not. X-Components do not track or process any personal data. This parameter is used to generate a unique session id                                                                                                                |
| documentDirection     | `'ltr'` &#124; `'rtl'`                                                               |          | The writing direction that the X Components should use                                                                                                                                                                                                                                          |
| currency              | `string`                                                                             |    ✅    | The currency identifier. Used to configure how prices are shown                                                                                                                                                                                                                                 |
| callbacks             | `Record<XEventName, (payload: XEventPayload<Event>, metadata: WireMetadata) => void` |          | A record of callbacks where the key is the event to listen, and the value is the callback to be executed whenever the event is emitted. For example, to listen to the `UserAcceptedAQuery` event: `{ UserAcceptedAQuery({ eventPayload }) { console.log('UserAcceptedAQuery', eventPayload); }` |
| isSpa                 | `boolean`                                                                            |          | True when the X Components archetype is being run on top of an SPA.                                                                                                                                                                                                                             |
| &lt;extra parameters> | `any`                                                                                |          | Any other parameter to be sent directly to the API calls. For example, some times is needed to filter the search catalog with a warehouse parameter. In that case you can just add `warehouse: <your-warehouse-identifier>` to the snippet config.                                              |

## X API

The X API allows your website to communicate with Interface&X. It is a set of utilities that helps
to integrate Interface&X into your website.

| Function | Parameters                                                                     | Description                                                 |
| -------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| init     | - [Snippet Configuration](#snippet-configuration) - The initialisation options | [Initialises Interface X on demand](#initialise-on-demand). |
| search   | - query (Optional) - The query to open Interface&nbsp;X with                   | Opens Interface&nbsp;X with the given search query.         |
