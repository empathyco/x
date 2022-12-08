---
title: Develop using the Interface X Components library
tags:
  - integration
  - interface x components integration
  - web integration
  - x integration
  - interface x
  - x components library
---

In this tutorial, you’ll learn the basics to integrate the Interface&nbsp;X&nbsp;Components library
in your own project to craft enticing Vue search experiences for your commerce store in a matter of
minutes.

::: interact

If you are looking to use the ready-to-go project Interface&nbsp;X&nbsp;Archetype as your starting
point, see **[Develop using Interface X Archetype](web-archetype-development-guide.md)**.

:::

For this tutorial, the Empathy Search API is used, but you can use any search API. This step-by-step
guide requires a knowledge of **JavaScript** and **Vue.js**.

You can find the X&nbsp;Components library in the
[Interface X open source project in GitHub](https://github.com/empathyco/x).

::: note Before you begin

To integrate the X&nbsp;Components in a frontend UI, you need:

- **Empathy Search API** to retrieve search data (or any other search API)
- A **search adapter** to communicate with the search API.
- Your commerce store built on a **Vue** project, or on a **React** project using the
  [React Wrapper](https://github.com/empathyco/x/tree/main/packages/react-wrapper).

:::

##### Steps to integrate the X&nbsp;Components in your project:

1. Install **project dependencies**.
2. Configure the **search adapter**.
3. Configure the **xPlugin**.
4. Install and **initialize the xPlugin**.

## Installing the dependencies

To build your search and discovery UI, the following project dependencies are required:

- **x-components** library
  ([`@empathyco/x-components`](https://github.com/empathyco/x/tree/main/packages/x-components)):
  Interface&nbsp;X&nbsp;Components Vue.js library to implement out-of-the-box search UI components
  in a couple of minutes.

- **x-adapter-platform**
  ([`@empathyco/x-adapter-platform`](https://github.com/empathyco/x/tree/main/packages/x-adapter-platform)):
  A search adapter connector that tells the app how to communicate with the Empathy Search API
  you’re using, translating the response into understandable information for X&nbsp;Components. If
  you are not using the Empathy Search API, you need to build your own search adapter. In order to
  build your own search adapter, you can either extend the **x-adapter-platform** or create a new
  one from scratch using the
  [`@empathyco/x-adapter`](https://github.com/empathyco/x/tree/main/packages/x-adapter) package.

- **x-types**
  ([`@empathyco/x-types`](https://github.com/empathyco/x/tree/main/packages/search-types)): The data
  model used in the X&nbsp;Components to define types.

Install the project dependencies via `npm` as follows:

```batch
//Install the dependencies via npm.
npm install --save @empathyco/x-components @empathyco/x-types @empathyco/x-adapter-platform
```

## Configuring the search adapter

You will need the search adapter in the [xPlugin configuration](#3-configure-the-plugin).

There are two libraries for making it easier to consume search APIs. The
[`@empathyco/x-adapter`](https://github.com/empathyco/x/tree/main/packages/x-adapter), which is the
interface you can use to build your own adapter for other APIs, and the
[`@empathyco/x-adapter-platform`](https://github.com/empathyco/x/tree/main/packages/x-adapter-platform),
which is the implementation to consume the Empathy Search Platform API, and it can be extended in
case your search API is similar to it.

::: warning

If you do not use the Empathy Search API, you need to build your own adapter.

:::

For more information, see the
[Empathy Search Adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter) and
[Empathy Platform Search Adapter](https://github.com/empathyco/x/tree/main/packages/x-adapter-platform)
libraries.

## Configuring the plugin

Plugins are self-contained code that usually add global-level functionality to Vue projects. They’re
specifically objects that expose an `install` method, allowing you to keep your components clear and
small.

The xPlugin is designed to connect the X&nbsp;Components to the Vue components in your project.

**Import** the xPlugin in your Vue instance.

```typescript
import Vue from 'vue';
import { xPlugin } from '@empathyco/x-components';
import { adapter } from './my-adapter';
import { store } from './my-store';
```

Then, **configure** the xPlugin. It has two key options you need to configure:

1. **Adapter**: A search adapter is required to connect and communicate with the search API. Here
   you’re using the `XAdapterPlatform` to communicate specifically with the Empathy Search Platform
   API. If you are not using the Empathy Search Platform API, you need to build your own adapter.
   See [Configure the search adapter](#2-configure-the-search-adapter).

2. **Store**: The Vuex store. If you use a store for Vuex, you need to provide the store you’re
   currently using for your project to the Vue instance.

   ::: warning

   If you don’t provide any parameters for the `store`, a default store is created automatically.
   Leave the `store` blank **only if you’re not using any store** for Vuex.

   :::

## Installing and initializing the plugin

Finally, the last step is to install and initialize the xPlugin. You need to do this in the
`main.ts` or `main.js file` of the project.

```typescript
//Initialize the plugin. Pass the search adapter and the store you use as parameters.
Vue.use(xPlugin, { adapter, store });
```

::: develop Next steps

Once you have integrated the Interface&nbsp;X&nbsp;Components in your project, you're ready to start
building your search and discovery UI:

- Change the **configuration of the [X Components](web-how-to-use-x-components-guide.md)** or create
  new ones.
- Adapt the
  **[design system](https://github.com/empathyco/x/blob/main/packages/x-components/contributing/design-system.md)**
  to your branding.

:::

<!-- Manage [internationalization options](https://github.com/empathyco/x/tree/main/packages/x-translations) to support different languages.-->

</br>

---

</br>
<VideoContent
:source="$withBase('/assets/media/videos/How-to-use-X-components-in-a-real-project.mp4')"
:poster="$withBase('/assets/media/videos/How-to-use-X-components-in-a-real-project.jpeg')"
>

Watch how our frontend Team Lead, [Iván Tajes](https://github.com/tajespasarela), integrates the
Interface&nbsp;X&nbsp;Components in a project from scratch.

</VideoContent>
