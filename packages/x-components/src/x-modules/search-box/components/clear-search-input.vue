<template>
  <BaseEventButton
    class="x-clear-search-input x-button"
    :class="dynamicClasses"
    :events="clearSearchInputEvents"
    data-test="clear-search-input"
  >
    <!-- @slot _Required_. Button content (text, icon, or both) -->
    <slot>✕</slot>
  </BaseEventButton>
</template>

<script lang="ts">
import type { VueCSSClasses } from '../../../utils/types'
import { computed, defineComponent, ref } from 'vue'
import BaseEventButton from '../../../components/base-event-button.vue'
import { useState } from '../../../composables/use-state'
import { searchBoxXModule } from '../x-module'

/**
 * This component renders a button to delete the current query.
 *
 * @remarks
 * A button that when pressed emits the {@link SearchBoxXEvents.UserPressedClearSearchBoxButton}
 * and {@link SearchBoxXEvents.UserClearedQuery} events, expressing the user intention to clear
 * the current query.
 * It also adds `x-clear-search-input--has-empty-query` as class when there is no query.
 *
 * @public
 */
export default defineComponent({
  name: 'ClearSearchInput',
  components: { BaseEventButton },
  xModule: searchBoxXModule.name,
  setup() {
    const { query } = useState('searchBox')

    /**
     * The events dictionary that are going to be emitted when the button is pressed.
     *
     * @internal
     */
    const clearSearchInputEvents = ref({
      UserPressedClearSearchBoxButton: undefined,
    })

    const isQueryEmpty = computed(() => query.value.length === 0)

    const dynamicClasses = computed<VueCSSClasses>(() => ({
      'x-clear-search-input--has-empty-query': isQueryEmpty.value,
    }))

    return {
      dynamicClasses,
      clearSearchInputEvents,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserPressedClearSearchBoxButton`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserClearedQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

Here a basic example of how the clear button is rendered.

_Type any term in the input field and then click the Clear button to try it out!_

```vue live
<template>
  <div style="display: flex;">
    <SearchInput />
    <ClearSearchInput />
  </div>
</template>

<script setup>
import { ClearSearchInput, SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Play with default slot

In this example, a custom text is passed in the default slot instead of the default text to
customize the button content.

_Click the icon button to try it out!_

```vue live
<template>
  <ClearSearchInput>Clear</ClearSearchInput>
</template>

<script setup>
import { ClearSearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Play with events

In this example, the `UserPressedClearSearchBoxButton` event is implemented, triggering the message
“clear” when the clear search input button is clicked.

_Click the Clear button to try it out!_

```vue live
<template>
  <div>
    <ClearSearchInput @UserPressedClearSearchBoxButton="message = 'clear'">Clear</ClearSearchInput>
    {{ message }}
  </div>
</template>

<script setup>
import { ClearSearchInput } from '@empathyco/x-components/search-box'
import { ref } from 'vue'

const message = ref('')
</script>
```

## Extending the component

Components can be combined and communicate with each other. Commonly, the `ClearSearchInput`
component communicates with the [`SearchInput`](./search-input.md), deleting the search term
entered.

_Type any term in the input field and then click the icon button to try it out!_

```vue live
<template>
  <div style="display: flex;">
    <SearchInput />
    <ClearSearchInput />
  </div>
</template>

<script setup>
import { SearchInput, ClearSearchInput } from '@empathyco/x-components/search-box'
</script>
```
</docs>
