<template>
  <input
    ref="inputElement"
    :maxlength="maxLength"
    :value="query"
    autocomplete="off"
    class="x-search-input x-input"
    enterkeyhint="search"
    inputmode="search"
    type="search"
    data-test="search-input"
    aria-label="type your query here"
    @mouseenter="emitUserHoveredInSearchBox"
    @mouseleave="emitUserHoveredOutSearchBox"
    @blur="emitUserBlurredSearchBox"
    @click="emitUserClickedSearchBox"
    @focus="emitUserFocusedSearchBox"
    @input="emitUserIsTypingAQueryEvents"
    @keydown.enter="emitUserPressedEnterKey"
    @keydown.up.down.prevent="emitUserPressedArrowKey"
    @beforeinput="preventSpecialKey"
  />
</template>

<script lang="ts">
import type { ArrowKey } from '../../../utils'
import type { DebouncedFunction } from '../../../utils/types'
import type { XEvent } from '../../../wiring/events.types'
import type { WireMetadata } from '../../../wiring/wiring.types'
import { defineComponent, onMounted, ref } from 'vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { debounce } from '../../../utils/debounce'
import { searchBoxXModule } from '../x-module'

/**
 * This component renders an input field that allows the user to type a query. It also reacts to
 * query changes through event listening.
 *
 * @public
 */
export default defineComponent({
  name: 'SearchInput',
  xModule: searchBoxXModule.name,
  props: {
    /**
     * Maximum characters allowed in the input search.
     */
    maxLength: {
      type: Number,
      default: 64,
    },
    /**
     * Allows input autofocus when the search field is rendered.
     */
    autofocus: {
      type: Boolean,
      default: true,
    },
    /**
     * Enables the auto-accept query after debounce.
     */
    instant: {
      type: Boolean,
      default: true,
    },
    /**
     * Debounce time for the instant.
     */
    instantDebounceInMs: {
      type: Number,
      default: 500,
    },
  },
  setup(props) {
    const $x = use$x()

    const { query } = useState('searchBox')

    const inputElement = ref<HTMLInputElement>()

    let debouncedUserAcceptedAQuery: DebouncedFunction<[string]>

    /**
     * Generates the {@link WireMetadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    const createEventMetadata = (): Omit<WireMetadata, 'moduleName'> => {
      return {
        target: inputElement.value,
        feature: 'search_box',
      }
    }

    /**
     * Emits {@link XEventsTypes.UserAcceptedAQuery} event.
     *
     * @remarks It is necessary in a separated method to use it as the parameter of debounce in
     * emitDebouncedUserAcceptedAQuery method.
     * @internal
     * @param query - The query that will be emitted.
     */
    const emitUserAcceptedAQuery = (query: string): void => {
      $x.emit('UserAcceptedAQuery', query, createEventMetadata())
    }

    /**
     * Emits {@link XEventsTypes.UserAcceptedAQuery} event with a debounce configured in
     * `instantDebounceInMs` prop.
     *
     * @internal
     * @param query - The query that will be emitted.
     */
    const emitDebouncedUserAcceptedAQuery = (query: string): void => {
      if (props.instant) {
        if (!debouncedUserAcceptedAQuery) {
          debouncedUserAcceptedAQuery = debounce(emitUserAcceptedAQuery, props.instantDebounceInMs)
        }
        debouncedUserAcceptedAQuery(query)
      }
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserHoveredInSearchBox} when search box is hovered in.
     *
     * @internal
     */
    const emitUserHoveredInSearchBox = (): void => {
      $x.emit('UserHoveredInSearchBox', undefined, { target: inputElement.value })
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserHoveredOutSearchBox} when search box is hovered out.
     *
     * @internal
     */
    const emitUserHoveredOutSearchBox = (): void => {
      $x.emit('UserHoveredOutSearchBox', undefined, { target: inputElement.value })
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserBlurredSearchBox} when search box loses focus.
     *
     * @internal
     */
    const emitUserBlurredSearchBox = (): void => {
      $x.emit('UserBlurredSearchBox', undefined, { target: inputElement.value })
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserClickedSearchBox} when user clicks  the search input.
     *
     * @internal
     */
    const emitUserClickedSearchBox = (): void => {
      $x.emit('UserClickedSearchBox', undefined, { target: inputElement.value })
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserFocusedSearchBox} when search box gains focus.
     *
     * @internal
     */
    const emitUserFocusedSearchBox = (): void => {
      $x.emit('UserFocusedSearchBox', undefined, { target: inputElement.value })
    }

    /**
     * Emits event {@link SearchBoxXEvents.UserIsTypingAQuery} when the user typed/pasted something
     * into the search-box. Also emits event {@link SearchBoxXEvents.UserClearedQuery} when the user
     * removes all characters in the search-box.
     *
     * @internal
     */
    const emitUserIsTypingAQueryEvents = (): void => {
      const query = inputElement.value?.value ?? ''

      $x.emit('UserIsTypingAQuery', query, { target: inputElement.value })
      if (query.trim()) {
        emitDebouncedUserAcceptedAQuery(query)
      } else {
        cancelDebouncedUserAcceptedAQuery()
      }
    }

    /**
     * Emits event {@link XEventsTypes.UserPressedArrowKey} when the user pressed an arrow key.
     *
     * @param event - The keyboard event with the arrow key pressed.
     * @internal
     */
    const emitUserPressedArrowKey = (event: KeyboardEvent): void => {
      $x.emit('UserPressedArrowKey', event.key as ArrowKey, createEventMetadata())
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
    const emitUserPressedEnterKey = (): void => {
      const query = inputElement.value?.value.trim()
      if (!!query && query.length > 0) {
        $x.emit('UserPressedEnterKey', query, createEventMetadata())
        emitUserAcceptedAQuery(query)
      }
      inputElement.value?.blur()
    }

    /**
     * Prevents the user from either typing or pasting special characters in the input field.
     *
     * @internal
     * @param event - The event that will be checked for special characters.
     */
    const preventSpecialKey = (event: InputEvent): void => {
      if (/[<>]/.test(event.data ?? '')) {
        event.preventDefault()
      }
    }

    /**
     * When event {@link XEventsTypes.UserReachedEmpathizeTop} or
     * {@link SearchBoxXEvents.UserPressedClearSearchBoxButton}
     * are emitted the search input is focused.
     *
     * @internal
     */
    function focusInput(): void {
      inputElement.value?.focus()
    }
    ;['UserReachedEmpathizeTop', 'UserPressedClearSearchBoxButton'].forEach(event =>
      $x.on(event as XEvent, false).subscribe(focusInput),
    )

    /**
     * When event {@link XEventsTypes.UserAcceptedAQuery} or
     * {@link SearchBoxXEvents.UserClearedQuery} are emitted the pending debounced emit
     * {@link XEvent} `UserAcceptedAQuery` is canceled.
     *
     * @internal
     */
    function cancelDebouncedUserAcceptedAQuery(): void {
      debouncedUserAcceptedAQuery?.cancel()
    }
    ;['UserAcceptedAQuery', 'UserClearedQuery'].forEach(event =>
      $x.on(event as XEvent, false).subscribe(cancelDebouncedUserAcceptedAQuery),
    )

    onMounted(() => {
      if (props.autofocus) {
        focusInput()
      }
    })

    return {
      query,
      inputElement,
      emitUserHoveredInSearchBox,
      emitUserHoveredOutSearchBox,
      emitUserBlurredSearchBox,
      emitUserClickedSearchBox,
      emitUserFocusedSearchBox,
      emitUserIsTypingAQueryEvents,
      emitUserPressedEnterKey,
      emitUserPressedArrowKey,
      preventSpecialKey,
    }
  },
})
</script>

<style lang="css" scoped>
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

- [`UserClickedSearchBox`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserBlurredSearchBox`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserFocusedSearchBox`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserIsTypingAQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserPressedEnterKey`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserPressedArrowKey`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserAcceptedAQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

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

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
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

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
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

<script setup>
import { SearchInput } from '@empathyco/x-components/search-box'
import { ref } from 'vue'

const value = ref('')
const hasFocus = ref(false)
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

<script setup>
import { SearchInput, ClearSearchInput, SearchButton } from '@empathyco/x-components/search-box'
import { QuerySuggestions } from '@empathyco/x-components/query-suggestions'
</script>
```
</docs>
