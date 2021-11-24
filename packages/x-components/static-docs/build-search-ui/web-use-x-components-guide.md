---
title: Use & configure Interface X Components in your project
tags:
  - configuration
  - x configuration
  - x component configuration
---

# Use and configure Interface X Components in your project

Interface&nbsp;X&nbsp;Components are like building blocks that you pick up and mix to craft your
search UI experiences. The goal of using components is to include only the components you want,
wherever you want. So, **just import the components, register, and go!**

Once you’ve installed the
[dependencies and the xPlugin](web-x-components-integration-guide.md#_1-install-the-dependencies),
you’re ready to use X&nbsp;Components in your project.

## 1. Import and register the X Components

Many of the X&nbsp;Components are distributed into modules to make them easier to manage. So you
need to indicate from which module you’re importing each component as appropriate.

For example, the `search-box` module contains the `SearchInput`, `SearchButton`, and
`ClearSearchInput` components.

### Import and register components from a module

When importing the components, you can register each component **locally for each Vue instance** as
you go.

```typescript
//Import each component you'd like to use, before you register it.
import { ComponentA } from './Module1';
import { ComponentB } from './Module1';
import { ComponentC } from './Module1';

//Locally register each component.
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

### Import and register components globally

Alternatively, you can **globally** register components in Vue directly in the `main.js` file if you
plan on using a component more than once in your app. By registering the components globally, you
can use them in the template of any root Vue instance you create afterwards.

::: develop Although you can register components globally, it should be done with caution as **it
may impact future performance**. Remember if you register the components globally, the entire
X&nbsp;Component module is loaded and registered each time this code line is run. :::

```typescript
import { ComponentA, ComponentB, ComponentC } from './ModuleA';

Vue.component('ComponentAName', ComponentA);
Vue.component('ComponentBName', ComponentB);
Vue.component('ComponentCName', ComponentC);
```

## 2. Configure the X Components

You can configure some behaviors for each component to customize the search experience.

To provide different project-specific behaviors, you can use:

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

You can combine components at your ease and use resource modules such as modals, panels, and
animations. You can also use base components, i.e. standard Vue components that don’t have any
dependencies with the X&nbsp;Components. Use them as a foundation to build other components.

Your components are ready to go, but you can provide your search UI with a friendly and fancy style
and layout. For more information, see
[Design tokens](https://github.com/empathyco/x/blob/main/packages/x-components/contributing/design-system.md).

<!--If you want to support multiple languages, you can use the [x-translation](https://github.com/empathyco/x/tree/main/packages/x-translations) library to manage localization options.-->

## Example: Using the search box components

To build your search UI, you need to provide at least a search field that allows users to input a
query. Additionally, you can include a button to trigger the search and a button to delete the input
query.

The search-box module contains these components:

- `SearchInput`
- `SearchButton`
- `ClearSearchInput`

::: interact Learn more about the
[Search Box UI](/explore-empathy-platform/experience-search-&-discovery/search-box.md) :::

### Importing the components from the search-box module

For this purpose, you need to import the `SearchInput`, `SearchButton`, and `ClearSearchInput`
components from the `search-box` module to the desired app component. Then, register them and
include them in the template.

First, import and locally register the components.

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

### Configuring the SearchInput component

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
