import { NextItem } from '@docusaurus/react-components/Utils';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { ReactQuerySuggestions, ReactSearchInput, ReactClearSearchInput, ReactFadeAndSlide } from '@docusaurus/react-components/ReactComponents';
import { FadeAndSlide } from '@empathyco/x-components/core';

:::caution
Before start you should install the [XPlugin](./install-xplugin)
:::

## First steps

To start using our components it is as easy as importing the component as if it were any other component created by yourself and
using it in your template.

## Examples

  ```jsx
<template>
  <div id="app">
    <SearchInput />
  </div>
</template>

<script>
  import { SearchInput} from '@empathyco/x-components/search-box';

  export default {
    name: 'App',
    components: {
      SearchInput
    }
  }
  </script>
  ```

## Basic example

This example shows the `Search Input`, `Clear Search Input` and `Query Suggestions` working together.

<Tabs
  defaultValue="vue"
  values={[
   {label: 'Vue', value: 'vue'},
   {label: 'Live', value: 'live'}
   ]}>
   <TabItem value="vue">

```jsx
<SearchInput />
<ClearSearchInput>Clear</ClearSearchInput>
<QuerySuggestions animation={FadeAndSlide} />
```

   </TabItem>
  <TabItem value="live">
    <div class='x-playground'>
        <ReactSearchInput />
        <ReactClearSearchInput>Clear</ReactClearSearchInput>
        <ReactQuerySuggestions animation={FadeAndSlide} />
   </div>
  </TabItem>
</Tabs>


 ## Up next

To know more about the components that you can use, continue reading this section about each component:

<NextItem color="#e77962" font='white' next="../getting-started/components/search-input">Search Input</NextItem>
