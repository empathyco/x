import { NextItem } from '@docusaurus/react-components/Utils';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { ReactSearchInput, doMagic } from '@docusaurus/react-components/ReactComponents';

The Search input is a component that reacts to user interaction emitting events:
[SearchBoxQueryChanged](../../x-components.searchboxxevents.searchboxquerychanged),
[UserBlurredSearchBox](../../x-components.searchboxxevents.userblurredsearchbox),
[UserFocusedSearchBox](../../x-components.searchboxxevents.userfocusedsearchbox),
[UserIsTypingAQuery](../../x-components.searchboxxevents.useristypingaquery) and
[UserPressedEnterKey](../../x-components.searchboxxevents.userpressedenterkey)

## Basic usage

Search input lets you to type a query and emits events to other components. This will allow to other components to use this query.

<Tabs
  defaultValue="vue"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'}
  ]
}>
  <TabItem value="vue">

  ```jsx
  <SearchInput />
  ```

  </TabItem>
  <TabItem value="live">
  <ReactSearchInput />
  </TabItem>
</Tabs>

## Configuring component by props

By prop, you can configure `maxLength`, `autofocus`, `instant`, `instantDebounceInMs`, `autocompleteKeyboardKeys` and `autocompleteSuggestionsEvent` of the component.

<Tabs
  defaultValue="vue"
  values={[
    {label: 'Vue', value: 'vue'},
    {label: 'Live', value: 'live'},
  ]
}>
  <TabItem value="vue">

  ```jsx
  <SearchInput :maxLength="5"
               :autofocus="false"
               :instant="true"
               :instantDebounceInMs="1000"
               :autocompleteKeyboardKeys="['ArrowDown']"
               :autocompleteSuggestionsEvent="'NextQueriesChanged'"/>
  ```

  </TabItem>
  <TabItem value="live">
  <ReactSearchInput maxLength="5"
                  autofocus="false"
                  instant="true"
                  instantDebounceInMs="1000"
                  autocompleteKeyboardKeys="['ArrowDown']"
                  autocompleteSuggestionsEvent="'NextQueriesChanged'"/>
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
  ]
}>
  <TabItem value="vue">

  ```jsx
    <SearchInput @UserPressedEnterKey="doMagic()" />
  ```

  </TabItem>
  <TabItem value="live">
  <ReactSearchInput on={{ UserPressedEnterKey: doMagic }} />
  </TabItem>
</Tabs>

## Up next

Ready for more? Continue reading with:

<NextItem color="#e77962" font='white' next="clear-search-input">Clear Search Input</NextItem>
