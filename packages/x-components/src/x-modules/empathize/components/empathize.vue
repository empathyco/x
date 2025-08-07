<template>
  <component :is="animation">
    <div
      v-show="isOpen && hasContent"
      ref="empathizeRef"
      class="x-empathize"
      data-test="empathize"
      @mousedown.prevent
      @focusin="open"
      @focusout="close"
    >
      <!-- @slot (Required) Modal container content -->
      <slot />
    </div>
  </component>
</template>

<script lang="ts">
import type { PropType, WatchStopHandle } from 'vue'
import type { XEvent } from '../../../wiring'
import { defineComponent, ref, watch } from 'vue'
import { NoAnimation } from '../../../components'
import { use$x, useDebounce } from '../../../composables'
import { AnimationProp } from '../../../types'
import { getActiveElement } from '../../../utils'
import { empathizeXModule } from '../x-module'

/**
 * Component containing the empathize. It has a required slot to define its content and two props
 * to define when to open and close it: `eventsToOpenEmpathize` and `eventsToCloseEmpathize`.
 *
 * @public
 */
export default defineComponent({
  name: 'Empathize',
  xModule: empathizeXModule.name,
  props: {
    /** Array of {@link XEvent} to open the empathize. */
    eventsToOpenEmpathize: {
      type: Array as PropType<XEvent[]>,
      default: () => ['UserFocusedSearchBox', 'UserIsTypingAQuery', 'UserClickedSearchBox'],
    },
    /** Array of {@link XEvent} to close the empathize. */
    eventsToCloseEmpathize: {
      type: Array as PropType<XEvent[]>,
      default: () => [
        'UserClosedEmpathize',
        'UserSelectedASuggestion',
        'UserPressedEnterKey',
        'UserBlurredSearchBox',
      ],
    },
    /** Animation component that will be used to animate the empathize. */
    animation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /** Whether the empathize has content or not. As it is only known in the client, it is a prop. */
    hasContent: {
      type: Boolean,
      default: true,
    },
    /** Fallback flag to trigger a search and close the empathize when has no-content. */
    searchAndCloseOnNoContent: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $x = use$x()
    const empathizeRef = ref<HTMLDivElement | null>(null)
    const isOpen = ref(false)

    /**
     * Changes the state of {@link Empathize.isOpen} assigning to it the value of `newOpen`
     * parameter. Also emits the {@link XEvent} `EmpathizeOpened` or `EmpathizeClosed` if
     * the state really changes.
     *
     * @param newOpen - The new open state to assign to {@link Empathize.isOpen}.
     */
    const changeOpen = useDebounce((newOpen: boolean) => {
      if (isOpen.value !== newOpen) {
        isOpen.value = newOpen
        // TODO - review isOpen && hasContent to emit event
        const empathizeEvent = isOpen.value ? 'EmpathizeOpened' : 'EmpathizeClosed'
        $x.emit(empathizeEvent, undefined, { target: empathizeRef.value })
      }
    }, 0)

    /**
     * Open empathize. This method will be executed on any event in
     * {@link Empathize.eventsToOpenEmpathize} and on DOM event `focusin` on Empathize root element.
     */
    function open() {
      changeOpen(true)
    }

    /**
     * Close empathize. This method will be executed on any event in
     * {@link Empathize.eventsToCloseEmpathize} and on DOM event `focusout` on Empathize root
     * element.
     */
    function close() {
      const activeElement = getActiveElement()
      if (!empathizeRef.value?.contains(activeElement)) {
        changeOpen(false)
      }
    }

    props.eventsToOpenEmpathize.forEach(event => $x.on(event, false).subscribe(open))
    props.eventsToCloseEmpathize.forEach(event => $x.on(event, false).subscribe(close))

    let unwatchSearchBoxQuery: WatchStopHandle = () => {}

    /**
     * This function unwatch the search-box query and also search and close empathize wrapped
     * under a debounced function.
     */
    const searchAndCloseDebounced = useDebounce(async () => {
      // eslint-disable-next-line no-console
      console.log('UserAcceptedAQuery', $x.query.searchBox)

      unwatchSearchBoxQuery()
      await $x.emit('UserAcceptedAQuery', $x.query.searchBox)
      close()
    }, 1000)

    /**
     * Watcher triggered when `hasContent` change and the `searchAndCloseOnNoContent` flag is active
     * with the following casuistics:
     * 1. Empathize has content: cancel debounced search and unwatch the search-box query.
     * 2. Empathize has NO content: create a watcher for the search-box query. It is to debounce the
     * search fallback when the user types in the search-box during debounced time.
     */
    watch(
      () => props.hasContent,
      () => {
        // eslint-disable-next-line no-console
        console.log('hasContent', props.hasContent)
        // eslint-disable-next-line no-console
        console.log('props.closeAndSearchOnNoContent', props.searchAndCloseOnNoContent)

        if (props.searchAndCloseOnNoContent) {
          if (props.hasContent) {
            unwatchSearchBoxQuery()
            searchAndCloseDebounced.cancel()
          } else {
            unwatchSearchBoxQuery = watch(() => $x.query.searchBox, searchAndCloseDebounced, {
              immediate: true,
            })
          }
        }
      },
    )

    return { isOpen, close, open }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`EmpathizeOpened`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after receiving an event to change the state `isOpen` to `true`. The event
  payload is undefined and can have a metadata with the module and the element that emitted it.
- [`EmpathizeClosed`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after receiving an event to change the state `isOpen` to `false`. The event
  payload is undefined and can have a metadata with the module and the element that emitted it.

## Examples

This component will listen to the configured events in `eventsToOpenEmpathize` and
`eventsToCloseEmpathize` props and open/close itself accordingly. By default, those props values
are:

- Open: `UserFocusedSearchBox`, `'`UserIsTypingAQuery`, `'`UserClickedSearchBox` and
- Close: `UserClosedEmpathize`, `UserSelectedASuggestion`, `UserPressedEnter`,
  'UserBlurredSearchBox`

### Basic examples

The component rendering the query suggestions, popular searches and history queries with keyboard
navigation.

```vue
<Empathize>
  <template #default>
    <BaseKeyboardNavigation>
      <QuerySuggestions/>
      <PopularSearches/>
      <HistoryQueries/>
    </BaseKeyboardNavigation>
  </template>
</Empathize>
```

Defining custom values for the events to open and close the Empathize. For example opening it when
the search box loses the focus and closing it when the search box receives the focus:

```vue
<Empathize
  :eventsToOpenEmpathize="['UserBlurredSearchBox']"
  :eventsToCloseEmpathize="['UserFocusedSearchBox']"
>
  <template #default>
    Please, type a query in the Search Box.
  </template>
</Empathize>
```

An animation can be used for the opening and closing using the `animation` prop. The animation, must
be a Component with a `Transition` with a slot inside:

```vue
<Empathize :animation="collapseFromTop">
  <template #default>
    <PopularSearches/>
  </template>
</Empathize>
```
</docs>
