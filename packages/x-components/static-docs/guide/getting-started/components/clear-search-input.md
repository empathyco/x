---
id: clear-search-input
title: Clear Search Input
sidebar_label: Clear Search Input
---
import { NextItem } from '../../../react-components/Utils';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { ReactClearSearchInput, ReactSearchInput, doMagic } from '../../../react-components/ReactComponents';

The ClearSearchInput is a button that when pressed emits [UserPressedClearsearchBoxButton](../../x-components.searchboxxevents.userpressedclearsearchboxbutton)
event, expressing the user intention to clear the current query.

## Basic Usage

<Tabs
  defaultValue="vue"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

  ```jsx
  <ClearSearchInput />
  ```

  </TabItem>
  <TabItem value="live">
   <ReactSearchInput />
   <ReactClearSearchInput> Clear </ReactClearSearchInput>
  </TabItem>
</Tabs>

 ## Overriding slot

  If You need to add custom content inside this component. You only need to pass a new
  component in the default slot:

<Tabs
  defaultValue="vue"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

  ```jsx
<ClearSearchInput>
    <img src="./my-awesome-clear-icon.svg" />
</ClearSearchInput>
  ```

  </TabItem>
  <TabItem value="live">
   <div style={{display:'flex'}}>
   <ReactSearchInput />
   <ReactClearSearchInput><img style={{height:'16px',margin:'0',border:'0'}}
   src="https://image.flaticon.com/icons/svg/864/864393.svg" /></ReactClearSearchInput>
   </div>
  </TabItem>
</Tabs>

## Using the events

:::info
There is a list of events that can be emitted. [XEvents](../../x-components.xeventstypes)
:::

Exist the possibility of call methods to do something when an event is emitted:

<Tabs
  defaultValue="vue"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

  ```jsx
<ClearSearchInput  @UserPressedClearSearchBoxButton="doMagic()" />
  ```

  </TabItem>
   <TabItem value="live">
     <ReactClearSearchInput on={ {UserPressedClearSearchBoxButton: doMagic} }> Clear </ReactClearSearchInput>
    </TabItem>
</Tabs>


 ## Up next

Ready for more? Continue reading with:

<NextItem color="#e77962" font="white" next="search-button">Search button</NextItem>



