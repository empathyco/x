<template>
  <BaseEventButton :events="events" class="x-search-button" :class="dynamicClasses">
    <!-- @slot (Required) To add an icon or text for the search button-->
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
   * Search button component which emits on its click {@link XEventsTypes.UserAcceptedAQuery} and
   * {@link SearchBoxXEvents.UserPressedSearchButton} events with the query as payload while there
   * is query. If the query is empty, the component won't emit any event. The component has also a
   * dynamic class to flag the HTML button when the query is empty (to hide the button when the
   * query is empty for instance).
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)],
    components: { BaseEventButton }
  })
  export default class SearchButton extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    protected get events(): Partial<XEventsTypes> {
      return !this.isQueryEmpty
        ? {
            UserAcceptedAQuery: this.query,
            UserPressedSearchButton: this.query
          }
        : {};
    }

    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-search-button--has-empty-query': this.isQueryEmpty
      };
    }
  }
</script>
<!--eslint-disable-->
<docs>
  import { NextItem } from './react-components/Utils';
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';
  import { ReactSearchButton, ReactSearchInput, doMagic } from './react-components/ReactComponents';

  Search button component which emits on its click
  [UserAcceptedAQuery](x-components.xeventstypes.useracceptedaquery) and
  [UserAcceptedAQuery](x-components.searchboxxevents.userpressedsearchbutton)
  events with the query as payload while there is query.
  If the query is empty, the component won't emit any event. The component has also a
  dynamic class to flag the HTML button when the query is empty (to hide the button when the
  query is empty for instance).

  ## Usage

  <Tabs
    defaultValue="vue"
    values={[
    {label: 'Vue', value: 'vue'},
  {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

    ```jsx
    <SearchButton />
    ```

  </TabItem>
  <TabItem value="live">

    <ReactSearchButton> Search </ReactSearchButton>

  </TabItem>
  </Tabs>

  ## Overriding slot

  If you need to add custom content inside this component. You only need to pass a new
  component in the default slot:

  <Tabs
    defaultValue="vue"
    values={[
    {label: 'Vue', value: 'vue'},
  {label: 'Live', value: 'live'},
  ]}>
  <TabItem value="vue">

    ```jsx
    <SearchButton>
      <img src="./my-awesome-clear-icon.svg" />
    </SearchButton>
    ```

  </TabItem>
  <TabItem value="live">
    <ReactSearchButton><img style={{height:'16px',margin:'0',border:'0'}}
                            src="https://image.flaticon.com/icons/svg/483/483356.svg" /></ReactSearchButton>
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
    <SearchButton @UserPressedSearchButton="doMagic()" />
    ```

  </TabItem>
  <TabItem value="live">
    <ReactSearchButton on={ {UserPressedSearchButton: doMagic} }> Search </ReactSearchButton>
  </TabItem>
  </Tabs>

  ## Used with other components

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

  ## Up next

  Ready for more? Continue reading with:

  <NextItem color="#e77962" font="white" next="x-components.querysuggestions">Query Suggestions</NextItem>

</docs>
