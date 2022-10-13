<template>
  <input
    ref="input"
    @mouseenter="emitUserHoveredInSearchBox"
    @mouseleave="emitUserHoveredOutSearchBox"
    @blur="emitUserBlurredSearchBox"
    @click="emitUserClickedSearchBox"
    @focus="emitUserFocusedSearchBox"
    @input="emitUserIsTypingAQueryEvents"
    @keydown.enter="emitUserPressedEnterKey"
    @keydown.up.down.prevent="emitUserPressedArrowKey"
    @beforeinput="preventSpecialKey"
    v-on="$listeners"
    :maxlength="maxLength"
    :value="query"
    autocomplete="off"
    class="x-input x-search-input"
    enterkeyhint="search"
    inputmode="search"
    type="search"
    data-test="search-input"
    :aria-label="searchInputMessage"
  />
</template>

<script lang="ts">
  import { Suggestion } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { ArrowKey, PropsWithType } from '../../../utils';
  import { debounce } from '../../../utils/debounce';
  import { DebouncedFunction } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * This component renders an input field that allows the user to type a query. It also reacts to
   * query changes through event listening.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInput extends Vue {
    public $refs!: { input: HTMLInputElement };

    protected searchInputMessage = 'type your query here';

    /**
     * Maximum characters allowed in the input search.
     */
    @Prop({ default: 64 })
    protected maxLength!: number;

    /**
     * Allows input autofocus when the search field is rendered.
     */
    @Prop({ default: true })
    protected autofocus!: boolean;

    /**
     * Enables the auto-accept query after debounce.
     */
    @Prop({ default: true })
    protected instant!: boolean;

    /**
     * Debounce time for the instant.
     */
    @Prop({ default: 500 })
    protected instantDebounceInMs!: number;

    /**
     * Keyboard keys to accept the autocomplete suggestion.
     */
    @Prop({ default: () => ['ArrowRight'] })
    protected autocompleteKeyboardKeys!: string[]; // https://keycode.info/

    /**
     * Event that retrieves the autocomplete suggestion.
     */
    @Prop({ default: 'QuerySuggestionsChanged' })
    protected autocompleteSuggestionsEvent!: PropsWithType<XEventsTypes, Suggestion[]>;

    @State('searchBox', 'query')
    public query!: string;

    /**
     * When event {@link XEventsTypes.UserReachedEmpathizeTop} or
     * {@link SearchBoxXEvents.UserPressedClearSearchBoxButton}
     * are emitted the search input is focused.
     *
     * @internal
     */
    @XOn(['UserReachedEmpathizeTop', 'UserPressedClearSearchBoxButton'])
    focusInput(): void {
      this.$refs.input?.focus();
    }

    protected debouncedUserAcceptedAQuery!: DebouncedFunction<[string]>;

    /**
     * When event {@link XEventsTypes.UserAcceptedAQuery} or
     * {@link SearchBoxXEvents.UserClearedQuery} are emitted the pending debounced emit
     * {@link XEvent} `UserAcceptedAQuery` is canceled.
     *
     * @internal
     */
    @XOn(['UserAcceptedAQuery', 'UserClearedQuery'])
    cancelDebouncedUserAcceptedAQuery(): void {
      this.debouncedUserAcceptedAQuery?.cancel();
    }

    mounted(): void {
      if (this.autofocus) {
        this.focusInput();
      }
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
          this.debouncedUserAcceptedAQuery = debounce(
            this.emitUserAcceptedAQuery.bind(this),
            this.instantDebounceInMs
          );
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
    protected createEventMetadata(): Omit<WireMetadata, 'moduleName'> {
      return {
        target: this.$refs.input,
        feature: 'search_box'
      };
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserHoveredInSearchBox} when search box is hovered in.
     *
     * @internal
     */
    protected emitUserHoveredInSearchBox(): void {
      this.$x.emit('UserHoveredInSearchBox', undefined, { target: this.$refs.input });
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserHoveredOutSearchBox} when search box is hovered out.
     *
     * @internal
     */
    protected emitUserHoveredOutSearchBox(): void {
      this.$x.emit('UserHoveredOutSearchBox', undefined, { target: this.$refs.input });
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserBlurredSearchBox} when search box loses focus.
     *
     * @internal
     */
    protected emitUserBlurredSearchBox(): void {
      this.$x.emit('UserBlurredSearchBox', undefined, { target: this.$refs.input });
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserClickedSearchBox} when user clicks  the search input.
     *
     * @internal
     */
    protected emitUserClickedSearchBox(): void {
      this.$x.emit('UserClickedSearchBox', undefined, { target: this.$refs.input });
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserFocusedSearchBox} when search box gains focus.
     *
     * @internal
     */
    protected emitUserFocusedSearchBox(): void {
      this.$x.emit('UserFocusedSearchBox', undefined, { target: this.$refs.input });
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
      this.$x.emit('UserIsTypingAQuery', query, { target: this.$refs.input });
      if (query.trim()) {
        this.emitDebouncedUserAcceptedAQuery(query);
      } else {
        this.cancelDebouncedUserAcceptedAQuery();
      }
    }

    /**
     * Emits event {@link XEventsTypes.UserPressedArrowKey} when the user pressed an arrow key.
     *
     * @param event - The keyboard event with the arrow key pressed.
     * @internal
     */
    protected emitUserPressedArrowKey(event: KeyboardEvent): void {
      this.$x.emit('UserPressedArrowKey', event.key as ArrowKey, this.createEventMetadata());
    }

    /**
     * Emits multiple events when the user pressed the enter key.
     *
     * @remarks
     * Emitted events are:
     * {@link SearchBoxXEvents.UserPressedEnterKey}
     * {@link XEventsTypes.UserAcceptedAQuery}
     *
     * @internal
     */
    protected emitUserPressedEnterKey(): void {
      const query = this.$refs.input.value.trim();
      if (query.length > 0) {
        this.$x.emit('UserPressedEnterKey', query, this.createEventMetadata());
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
      this.$x.emit('UserAcceptedAQuery', query, this.createEventMetadata());
    }

    /**
     * Prevents the user from either typing or pasting special characters in the input field.
     *
     * @internal
     * @param event - The event that will be checked for special characters.
     */
    protected preventSpecialKey(event: InputEvent): void {
      if (/[<>]/.test(event.data ?? '')) {
        event.preventDefault();
      }
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

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedSearchBox`](./../../api/x-components.searchboxxevents.md)
- [`UserBlurredSearchBox`](./../../api/x-components.searchboxxevents.md)
- [`UserFocusedSearchBox`](./../../api/x-components.searchboxxevents.md)
- [`UserIsTypingAQuery`](./../../api/x-components.searchboxxevents.md)
- [`UserPressedEnterKey`](./../../api/x-components.searchboxxevents.md)
- [`UserPressedArrowKey`](./../../api/x-components.xeventstypes.md)
- [`UserAcceptedAQuery`](./../../api/x-components.xeventstypes.md)

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
To use this component, the Search service must be implemented.
:::
<!-- prettier-ignore-end -->

Here you have a basic example of how the search input is rendered.

_Type any term in the input field to try it out!_

```vue live
<template>
  <SearchInput />
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputDemo',
    components: {
      SearchInput
    }
  };
</script>
```

### Play with props

In this example, the search input has been limited to accept a maximum of 5 characters, including
spaces, it won't take the focus when it is rendered, and it will emit the `UserAcceptedAQuery` event
after 1000 milliseconds without typing.

_Type a term with more than 5 characters to try it out!_

```vue live
<template>
  <SearchInput :maxLength="5" :autofocus="false" :instant="true" :instantDebounceInMs="1000" />
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputDemo',
    components: {
      SearchInput
    }
  };
</script>
```

### Play with events

In this example, a message has been added below the search input to illustrate the action performed.
For example, if you select the search input box, the message “focus” appears. When you start to
enter a search term, the message “typing” appears. If you press Enter after typing a search term,
the message “enter” appears.

<!-- prettier-ignore-start -->
:::warning X Events are only emitted from the root X Component.
At the moment, X Events are only emitted from the root X Component. This means that if you wrap
the `SearchInput` with another component of another module like the `MainScroll`, you should add
the listeners to the `MainScroll` instead of the `SearchInput`. If you need to subscribe to these
events, it is recommended to use the [`GlobalXBus`](../common/x-components.global-x-bus.md)
component instead.
:::
<!-- prettier-ignore-end -->

_Type any term in the input field to try it out!_

```vue live
<template>
  <div>
    <SearchInput
      @UserPressedEnterKey="value = 'enter'"
      @UserFocusedSearchBox="hasFocus = true"
      @UserBlurredSearchBox="hasFocus = false"
      @UserIsTypingAQuery="value = 'typing'"
    />
    <strong>{{ value }}</strong>
    <span>{{ hasFocus ? 'focused' : 'unfocused' }}</span>
  </div>
</template>

<script>
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputDemo',
    components: {
      SearchInput
    },
    data() {
      return {
        value: '',
        hasFocus: false
      };
    }
  };
</script>
```

## Extending the component

Components can be combined and communicate with each other. Commonly, the `SearchInput` component
communicates with the [`SearchButton`](x-components.search-button.md) and the
[`ClearSearchInput`](x-components.clear-search-input.md) to offer a full query entry experience.
Furthermore, you can use it together with the [`QuerySuggestions`](query-suggestions.md) component
to autocomplete the typed search term.

_Type “trousers” or another fashion term in the input field and then click the clear icon to try it
out!_

```vue live
<template>
  <div>
    <div style="display: flex; flex-flow: row nowrap;">
      <SearchInput />
      <ClearSearchInput>
        <img src="/assets/icons/cross.svg" />
      </ClearSearchInput>
      <SearchButton>Search</SearchButton>
    </div>
    <QuerySuggestions />
  </div>
</template>

<script>
  import { SearchInput, ClearSearchInput, SearchButton } from '@empathyco/x-components/search-box';
  import { QuerySuggestions } from '@empathyco/x-components/query-suggestions';

  export default {
    name: 'SearchInputDemo',
    components: {
      SearchInput,
      ClearSearchInput,
      SearchButton,
      QuerySuggestions
    }
  };
</script>
```
</docs>
