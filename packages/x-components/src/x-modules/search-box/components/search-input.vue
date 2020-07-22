<template>
  <input
    ref="input"
    @blur="emitUserBlurredSearchBox"
    @focus="emitUserFocusedSearchBox"
    @input="emitUserIsTypingAQueryEvents"
    @keydown.enter="emitUserPressedEnterKey"
    @keydown.up.down.prevent="emitUserPressedArrowKey"
    :maxlength="maxLength"
    :value="query"
    autocomplete="off"
    class="x-input x-search-input"
    inputmode="search"
    type="search"
    data-test="search-input"
  />
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, XOn } from '../../../components/decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { ArrowKey, PropsWithType } from '../../../utils';
  import { debounce, DebouncedFunction } from '../../../utils/debounce';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * Search input that reacts to user interaction emitting events.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInput extends Vue {
    public $refs!: { input: HTMLInputElement };

    /**
     * Max characters number allowed in the input search.
     */
    @Prop({ default: 64 })
    protected maxLength!: number;

    /**
     * Allow input autofocus when the search box has been rendered.
     */
    @Prop({ default: true })
    protected autofocus!: boolean;

    /**
     * Enable the auto accept query after debounce.
     */
    @Prop({ default: true })
    protected instant!: boolean;

    /**
     * The debounce time for the instant.
     */
    @Prop({ default: 500 })
    protected instantDebounceInMs!: number;

    /**
     * Keyboard keys to accept the autocomplete suggestion.
     */
    @Prop({ default: () => ['ArrowRight'] })
    protected autocompleteKeyboardKeys!: string[]; // https://keycode.info/

    /**
     * Event to retrieve the suggestion will be used to autocomplete.
     */
    @Prop({ default: 'QuerySuggestionsChanged' })
    protected autocompleteSuggestionsEvent!: PropsWithType<XEventsTypes, Suggestion[]>;

    @State('searchBox', 'query')
    public query!: string;

    /**
     * Focus search input when the user navigates to the search input.
     *
     * @internal
     */
    @XOn('UserReachedEmpathizeTop')
    focusInput(): void {
      this.$refs.input?.focus();
    }

    protected debouncedUserAcceptedAQuery!: DebouncedFunction<[string]>;

    /**
     * When event {@link XEventsTypes.UserAcceptedAQuery} is emitted the pending debounced emit
     * {@link XEvent} `UserAcceptedAQuery` is canceled.
     *
     * @internal
     */
    @XOn('UserAcceptedAQuery')
    cancelDebouncedUserAcceptedAQuery(): void {
      this.debouncedUserAcceptedAQuery?.cancel();
    }

    /**
     * Emits {@link XEventsTypes.UserAcceptedAQuery} event with a debounce configured in
     * `instantDebounceInMs` prop.
     *
     * @internal
     * @param query - The query that will be emitted.
     */
    emitDebouncedUserAcceptedAQuery(query: string): void {
      if (this.instant) {
        if (!this.debouncedUserAcceptedAQuery) {
          this.debouncedUserAcceptedAQuery =
            debounce(this.emitUserAcceptedAQuery.bind(this), this.instantDebounceInMs);
        }
        this.debouncedUserAcceptedAQuery(query);
      }
    }

    /**
     * Generates the {@link WireMetadata | event metadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    protected eventMetadata(): Omit<WireMetadata, 'moduleName'> {
      return {
        target: this.$refs.input
      };
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserBlurredSearchBox} when search box loses focus.
     *
     * @internal
     */
    protected emitUserBlurredSearchBox(): void {
      this.$x.emit('UserBlurredSearchBox', undefined, this.eventMetadata());
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserFocusedSearchBox} when search box gains focus.
     *
     * @internal
     */
    protected emitUserFocusedSearchBox(): void {
      this.$x.emit('UserFocusedSearchBox', undefined, this.eventMetadata());
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserIsTypingAQuery} when the user typed/pasted something
     * into the search-box. Also emits event {@link SearchBoxXEvents.UserClearedQuery} when the user
     * removes all characters in the search-box.
     *
     * @internal
     */
    protected emitUserIsTypingAQueryEvents(): void {
      const query = this.$refs.input.value;
      if (query.trim()) {
        this.$x.emit('UserIsTypingAQuery', query, this.eventMetadata());
        this.emitDebouncedUserAcceptedAQuery(query);
      } else if (!query) {
        this.$x.emit('UserClearedQuery', undefined, this.eventMetadata());
      }
    }

    /**
     * Emits event {@link XEventsTypes.UserPressedArrowKey} when the user pressed an arrow key.
     *
     * @param event - The keyboard event with the arrow key pressed.
     * @internal
     */
    protected emitUserPressedArrowKey(event: KeyboardEvent): void {
      this.$x.emit('UserPressedArrowKey', event.key as ArrowKey, this.eventMetadata());
    }

    /**
     * Emits multiple events when the user pressed the enter key.
     *
     * @remarks
     * Emitted events are:
     * * {@link SearchBoxXEvents.UserPressedEnterKey}
     * * {@link XEventsTypes.UserAcceptedAQuery}
     *
     * @internal
     */
    protected emitUserPressedEnterKey(): void {
      const query = this.$refs.input.value.trim();
      if (query.length > 0) {
        this.$x.emit('UserPressedEnterKey', query, this.eventMetadata());
        this.emitUserAcceptedAQuery(query);
      }
      this.$refs.input?.blur();
    }

    /**
     * Emits {@link XEventsTypes.UserAcceptedAQuery} event.
     *
     * @remarks It is necessary in a separated method to use it as the parameter of debounce in
     * emitDebouncedUserAcceptedAQuery method.
     * @internal
     * @param query - The query that will be emitted.
     */
    protected emitUserAcceptedAQuery(query: string): void {
      this.$x.emit('UserAcceptedAQuery', query, this.eventMetadata());
    }
  }
</script>

<style lang="scss" scoped>
  .x-search-input::-webkit-search-decoration,
  .x-search-input::-webkit-search-cancel-button,
  .x-search-input::-webkit-search-results-button,
  .x-search-input::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
</style>
<!--eslint-disable-->
<docs>
  import { NextItem } from './react-components/Utils';
  import Tabs from '@theme/Tabs';
  import TabItem from '@theme/TabItem';
  import { ReactSearchInput, doMagic } from './react-components/ReactComponents';

  The Search input is a component that reacts to user interaction emitting events:
  [SearchBoxQueryChanged](x-components.searchboxxevents.searchboxquerychanged),
  [UserBlurredSearchBox](x-components.searchboxxevents.userblurredsearchbox),
  [UserFocusedSearchBox](x-components.searchboxxevents.userfocusedsearchbox),
  [UserIsTypingAQuery](x-components.searchboxxevents.useristypingaquery) and
  [UserPressedEnterKey](x-components.searchboxxevents.userpressedenterkey)

  ## Basic usage

  Search input lets you to type a query and emits events to other components. This will allow to other components to use this query.

  <Tabs
    defaultValue="vue"
    values={[
      {label:'Vue', value: 'vue'},
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

  By prop, you can configure `maxLength`, `autofocus`, `instant`, `instantDebounceInMs`,
  `autocompleteKeyboardKeys` and `autocompleteSuggestionsEvent` of the component.

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

  <NextItem color="#e77962" font='white' next="x-components.clearsearchinput">Clear Search Input</NextItem>
</docs>
