<template>
  <BaseEventButton
    class="x-clear-search-input"
    :class="dynamicClasses"
    :events="clearSearchInputEvents"
    data-test="clear-search-input"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * A button that when pressed emits the {@link SearchBoxXEvents.UserPressedClearSearchBoxButton}
   * and {@link SearchBoxXEvents.UserClearedQuery} events, expressing the user intention to clear
   * the current query.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class ClearSearchInput extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-clear-search-input--has-empty-query': this.isQueryEmpty
      };
    }

    /**
     * The events dictionary that are going to be emitted when the button is pressed.
     *
     * @internal
     */
    protected clearSearchInputEvents: Partial<XEventsTypes> = {
      UserClearedQuery: undefined,
      UserPressedClearSearchBoxButton: undefined
    };
  }
</script>
<!--eslint-disable-->
<docs>
  import { NextItem } from '../react-components/Utils';
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';
  import { ReactClearSearchInput, ReactSearchInput, doMagic } from '../react-components/ReactComponents';

  The ClearSearchInput is a button that when pressed emits [UserPressedClearsearchBoxButton](x-components.searchboxxevents.userpressedclearsearchboxbutton)
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
    <ReactSearchInput />
    <ReactClearSearchInput><img style={{height:'16px',margin:'0',border:'0'}}
                                src="https://image.flaticon.com/icons/svg/864/864393.svg" /></ReactClearSearchInput>
  </TabItem>
  </Tabs>

  ## Using the events

  :::info
  There is a list of events that can be emitted. [XEvents](x-components.xeventstypes)
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


  ## Used with other components

  If you want to use this component with another one, you can add other components and they will communicate with each other.

  This example shows how the clear search button communicates with the <Highlight color="#25c2a0">Search Input</Highlight>:

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
    <div style={{display:'flex',alignItems:'center'}} ><ReactSearchInput></ReactSearchInput><ReactClearSearchInput><img style={{height:'16px',margin:'0',border:'0'}} src="https://image.flaticon.com/icons/svg/864/864393.svg" /></ReactClearSearchInput></div>
  </TabItem>
  </Tabs>



  ## Up next

  Ready for more? Continue reading with:

  <NextItem color="#e77962" font="white" next="x-components.searchbutton">Search button</NextItem>

  ---
  id: x-components.clearsearchinput
  title: Clear Search Input
  sidebar_label: Clear Search Input
  ---
</docs>
