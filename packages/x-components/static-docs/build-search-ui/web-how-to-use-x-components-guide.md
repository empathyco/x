---
title: How to use and configure Interface X Components in your project
tags:
  - configuration
  - x configuration
  - x component configuration
  - use x components
  - how to
---

Interface&nbsp;X&nbsp;Components are like building blocks that you pick up and mix to craft your
search UI experiences. The goal of using components is to include only the components you want,
wherever you want.

Once you’ve installed the
[dependencies and the xPlugin](web-x-components-development-guide.md#1-install-the-dependencies),
you’re ready to use X&nbsp;Components in your project.

##### Steps to use X&nbsp;Components in your project:

1. **Import and register** X&nbsp;Components from a module.

2. **Configure the X&nbsp;Components behavior** to customize the search and discovery experience.

## Importing and registering the X Components

Many of the X&nbsp;Components are distributed into modules to make them easier to manage. So you
need to indicate from which module you’re importing each component as appropriate.

For example, the `search-box` module contains the `SearchInput`, `SearchButton`, and
`ClearSearchInput` components. See
[Using the search box components](#example-using-the-search-box-components) for an example on how to
import and register the Search box components in a project.

When importing the components, you can register each component **locally for each Vue instance** as
you go.

```typescript
//Import every component you'd like to use.
import { ComponentA } from './Module1';
import { ComponentB } from './Module1';
import { ComponentC } from './Module1';

//Register the components locally.
export default {
  components: {
    ComponentA,
    ComponentB,
    ComponentC
  }
  // ...
};

//The components are now ready to be used inside your template.
```

## Configuring the X Components

You can configure some behaviors for each component to customize the search experience.

To provide different project-specific behaviors, you use:

- **Props**: custom attributes to pass data into a component. It modifies the behavior or the
  properties in a component.

```vue
//Configure a component with props.
<SearchInput :maxLength="5" :autofocus="false" :instant="true" :instantDebounceInMs="1000" />
```

- **Scoped slots**: a slot exposes data from a child component to create your own custom
  implementation.

```vue
//Configure a component with slots.
<ClearSearchInput>Clear</ClearSearchInput>
```

You can pass the configuration attributes documented in the
[UI Reference](/develop-empathy-platform/ui-reference/) for the Interface&nbsp;X&nbsp;Components.
Combine components at your ease and use resource modules such as **modals**, **panels**, and
**animations**. You also use
**[base components](/develop-empathy-platform/ui-reference/components/base-components/)**, i.e.
standard Vue components that don’t have any dependencies with the X&nbsp;Components. Use them as a
foundation to build other components.

::: develop Next steps

Your components are ready to go, but you can provide your search UI with a friendly and fancy style
and layout. For more information, see
[Design tokens](https://github.com/empathyco/x/blob/main/packages/x-components/contributing/design-system.md).

:::

<!--If you want to support multiple languages, you can use the [x-translation](https://github.com/empathyco/x/tree/main/packages/x-translations) library to manage localization options.-->

## Example: Using the search box components

To build your search UI, you need to provide at least a search field that allows users to input a
query. Additionally, you can include a button to trigger the search and a button to delete the input
query.

The `search-box` module contains these components:

- `SearchInput`
- `SearchButton`
- `ClearSearchInput`

::: interact

Learn more about the
[Search Box UI](/explore-empathy-platform/experience-search-and-discovery/search-box.md)

:::

**1. Importing the components from the search-box module**

For this purpose, you need to import the `SearchInput`, `SearchButton`, and `ClearSearchInput`
components from the `search-box` module to the desired app component. Then, register them and
include them in the template.

First, **import and locally register** the components.

```vue
//Import the components from the corresponding module.
<script>
  import { SearchInput, SearchButton, ClearSearchInput } from '@empathyco/x-components/search-box';

  //Locally register each component.
  export default {
    components: { SearchInput, SearchButton, ClearSearchInput }
  };
</script>
```

Now, you’re ready to start using the component wherever you want in your template.

```vue
<template>
  <div>
    <SearchInput />
    <SearchButton />
    <ClearSearchInput />
  </div>
</template>
```

**2. Configuring the SearchInput component**

Next, you want to configure the behavior of the `SearchInput` component. Here you use the
`maxLength` prop to limit the maximum length to 20 characters.

```vue
<SearchInput
  :maxLength="20"
  :autofocus="false"
  :instant="true"
  :instantDebounceInMs="1000"
  :autocompleteKeyboardKeys="['ArrowDown']"
  :autocompleteSuggestionsEvent="'NextQueriesChanged'"
/>
```

**3. Listening to X Events**

For advanced use cases you might need to subscribe to certain `XEvent`. The recommended way to do so
is by using the `GlobalXBus` component.

In this example you are subscribing to the `UserAcceptedAQuery` event. This event is emitted both by
the `SearchInput` component and by the `QuerySuggestions` one.

```vue live
<template>
  <div>
    <GlobalXBus @UserAcceptedAQuery="logUserAcceptedAQuery" />
    <SearchInput />
    <QuerySuggestions />
  </div>
</template>
<script>
  import { GlobalXBus } from '@empathyco/x-components';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';

  export default {
    name: 'Demo',
    components: {
      GlobalXBus,
      SearchInput,
      QuerySuggestions
    },
    methods: {
      logUserAcceptedAQuery(query, metadata) {
        console.log('UserAcceptedAQuery', query, metadata);
      }
    }
  };
</script>
```
