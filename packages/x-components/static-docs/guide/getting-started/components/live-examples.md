import { ReactQuerySuggestions, ReactSearchInput, ReactClearSearchInput, ReactFadeAndSlide, ReactSearchButton } from '@docusaurus/react-components/ReactComponents';
import { FadeAndSlide } from '@empathyco/x-components/core';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


This section is intended to show the different ways of using the x components.

:::info
All the components showed below has custom styles. This is not the real look.
:::

## Search Input + Search Button

If you want to use this component with another one, you can add other components and they will communicate with each other.

This example shows how the search button communicates with the `Search Input`.


<Tabs
  defaultValue="live"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

  ```jsx
<SearchInput />
<SearchButton />
  ```

  </TabItem>
  <TabItem value="live">

  <ReactSearchInput /><ReactSearchButton> Search </ReactSearchButton>

  </TabItem>
</Tabs>


## Search Input + Clear Search Input

If you want to use this component with another one, you can add other components and they will communicate with each other.

This example shows how the clear search button communicates with the Search Input:

<Tabs
  defaultValue="vue"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

  ```jsx
<SearchInput />
<ClearSearchInput>
    <img src="./my-awesome-clear-icon.svg" />
</ClearSearchInput>
  ```

  </TabItem>
  <TabItem value="live">
   <div style={{display:'flex',alignItems:'center'}} ><ReactSearchInput></ReactSearchInput><ReactClearSearchInput><img style={{height:'16px',margin:'0',border:'0'}}
   src="https://image.flaticon.com/icons/svg/864/864393.svg" /></ReactClearSearchInput></div>
  </TabItem>
</Tabs>


## Search Input + Query Suggestions

If you want to use this component with another one, you can add other components and they will communicate with each other.

This example shows how the query suggestions communicates with the `Search Input`:

<Tabs
  defaultValue="live"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

  ```jsx
  <SearchInput />
  <QuerySuggestions />
  ```

   </TabItem>
   <TabItem value="live">
        <ReactSearchInput></ReactSearchInput><ReactQuerySuggestions animation={FadeAndSlide}/>
   </TabItem>
</Tabs>

