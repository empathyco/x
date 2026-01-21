<template>
  <div
    ref="rootRef"
    :class="dropdownCSSClasses"
    class="x-dropdown"
    @keydown="updateSearchBuffer"
    @keydown.down.prevent="highlightNextItem"
    @keydown.up.prevent="highlightPreviousItem"
  >
    <button
      ref="toggleButtonRef"
      class="x-dropdown__toggle"
      data-test="dropdown-toggle"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen.toString()"
      :aria-controls="listId"
      :aria-label="ariaLabel"
      aria-autocomplete="none"
      @click="toggle"
      @keydown.up.down.prevent.stop="open"
    >
      <!--
       @slot Used to render the contents of the dropdown toggle button. If not provided, it uses
       the item slot as fallback.
       @binding {string|number|Identifiable} item - The item data to render.
       @binding {boolean} isOpen - True if the dropdown is opened, and false if it is closed.
     -->
      <slot v-if="hasToggleSlot" :is-open="isOpen" :item="modelValue" name="toggle">
        {{ modelValue }}
      </slot>
      <slot v-else :item="modelValue" name="item">{{ modelValue }}</slot>
    </button>

    <component :is="animation">
      <ul
        v-show="isOpen"
        :id="listId"
        class="x-dropdown__items-list"
        data-test="dropdown-list"
        role="listbox"
        tabindex="-1"
        @keydown.end="highlightLastItem"
        @keydown.esc="closeAndFocusToggleButton"
        @keydown.home="highlightFirstItem"
      >
        <li v-for="(item, index) in items" :key="item.id || item" class="x-dropdown__list-item">
          <button
            :ref="el => (itemsButtonRefs[index] = el)"
            :aria-selected="(item === modelValue).toString()"
            :class="itemsCSSClasses[index]"
            class="x-dropdown__item"
            data-test="dropdown-item"
            role="option"
            @click="emitSelectedItemChanged(item)"
          >
            <!--
               @slot (required) Used to render each one of the items content, and as fallback
               for the toggle button content slot if it is not provided.
               @binding {string|number|Identifiable} item - Item to render
               @binding {boolean} isHighlighted - True when the item has the focus.
               @binding {boolean} isSelected - True when the item is selected.
             -->
            <slot
              :is-highlighted="index === highlightedItemIndex"
              :is-selected="item === modelValue"
              :item="item"
              name="item"
            >
              {{ item }}
            </slot>
          </button>
        </li>
      </ul>
    </component>
  </div>
</template>

<script lang="ts">
import type { Identifiable } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { AnimationProp } from '../types'
import { debounceFunction, getTargetElement, normalizeString } from '../utils'
import { NoAnimation } from './animations'

type DropdownItem = string | number | Identifiable
let dropdownCount = 0

/**
 * Dropdown component that mimics a Select element behavior, but with the option
 * to customize the toggle button and each item contents.
 */
export default defineComponent({
  name: 'BaseDropdown',
  props: {
    /** List of items to display.*/
    items: {
      type: Array as PropType<DropdownItem[]>,
      required: true,
    },
    /** The selected item. */
    modelValue: {
      type: null as unknown as PropType<DropdownItem | null>,
      validator: (v: any) =>
        typeof v === 'string' || typeof v === 'number' || typeof v === 'object' || v === null,
      required: true,
    },
    /** Description of what the dropdown is used for. */
    ariaLabel: String,
    /**
     * Animation component to use for expanding the dropdown. This is a single element animation,
     * so only `<transition>` components are allowed.
     */
    animation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /** Time to wait without receiving any keystroke before resetting the items search query. */
    searchTimeoutMs: {
      type: Number,
      default: 1000,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const rootRef = ref<HTMLElement>()
    /** The button that opens and closes the list of options. */
    const toggleButtonRef = ref<HTMLButtonElement>()
    /** Array containing the dropdown list buttons HTMLElements. */
    const itemsButtonRefs = ref<HTMLButtonElement[]>([])

    /** Property to check whether the dropdown is expanded or closed. */
    const isOpen = ref(false)
    /** Index of the element that has the focus in the list. -1 means no element has focus. */
    const highlightedItemIndex = ref(-1)
    /** String to search for the first element that starts with it. */
    const searchBuffer = ref('')

    /** Resets the search buffer after a certain time has passed. */
    let restartResetSearchTimeout: () => void
    /* Unique ID to identify the dropdown. */
    const listId = `x-dropdown-${dropdownCount++}`

    /**
     * Dynamic CSS classes to add to the dropdown root element.
     *
     * @returns An object containing the CSS classes to add to the dropdown root element.
     */
    const dropdownCSSClasses = computed(() => ({ 'x-dropdown--is-open': isOpen }))

    /**
     * Dynamic CSS classes to add to each one of the items.
     *
     * @returns An object containing the CSS classes to add to each item.
     */
    const itemsCSSClasses = computed(() =>
      props.items.map((item, index) => ({
        'x-dropdown__item--is-selected': props.modelValue === item,
        'x-dropdown__item--is-highlighted': highlightedItemIndex.value === index,
      })),
    )

    /* Opens the dropdown. */
    const open = () => (isOpen.value = true)
    /* Closes the dropdown. */
    const close = () => (isOpen.value = false)
    /* Toggles the dropdown. */
    const toggle = () => (isOpen.value = !isOpen.value)

    /**
     * Closes the modal and focuses the toggle button.
     */
    function closeAndFocusToggleButton() {
      close()
      toggleButtonRef.value?.focus()
    }

    /**
     * Emits the event that the selected item has changed.
     *
     * @param item - The new selected item.
     */
    function emitSelectedItemChanged(item: DropdownItem) {
      emit('update:modelValue', item)
      closeAndFocusToggleButton()
    }

    /**
     * Highlights the item after the one that is currently highlighted.
     */
    function highlightNextItem() {
      open()
      highlightedItemIndex.value = (highlightedItemIndex.value + 1) % props.items.length
    }

    /**
     * Highlights the item before the one that is currently highlighted.
     */
    function highlightPreviousItem() {
      const currentIndex = highlightedItemIndex.value
      open()
      highlightedItemIndex.value = currentIndex > 0 ? currentIndex - 1 : props.items.length - 1
    }

    /**
     * Highlights the first of the provided items.
     */
    function highlightFirstItem() {
      highlightedItemIndex.value = 0
    }

    /**
     * Highlights the last of the provided items.
     */
    function highlightLastItem() {
      highlightedItemIndex.value = props.items.length - 1
    }

    /**
     * Updates the variable that is used to search in the filters.
     *
     * @param event - The event coming from the user typing.
     */
    function updateSearchBuffer(event: KeyboardEvent) {
      if (/^\w$/.test(event.key)) {
        const key = event.key
        searchBuffer.value += key
        restartResetSearchTimeout()
      }
    }

    /**
     * Resets the search buffer.
     */
    function resetSearchBuffer() {
      searchBuffer.value = ''
    }

    /**
     * Closes the dropdown if the passed event has happened on an element out of the dropdown.
     *
     * @param event - The event to check if it has happened out of the dropdown component.
     */
    function closeIfEventIsOutOfDropdown(event: MouseEvent | TouchEvent | FocusEvent) {
      if (!rootRef.value?.contains(getTargetElement(event))) {
        close()
      }
    }

    /**
     * Adds listeners to the document element to detect if the focus has moved out from the
     * dropdown.
     */
    function addDocumentCloseListeners() {
      document.addEventListener('mousedown', closeIfEventIsOutOfDropdown)
      document.addEventListener('touchstart', closeIfEventIsOutOfDropdown)
      document.addEventListener('focusin', closeIfEventIsOutOfDropdown)
    }

    /**
     * Removes the listeners of the document element to detect if the focus has moved out from the
     * dropdown.
     */
    function removeDocumentCloseListeners() {
      document.removeEventListener('mousedown', closeIfEventIsOutOfDropdown)
      document.removeEventListener('touchstart', closeIfEventIsOutOfDropdown)
      document.removeEventListener('focusin', closeIfEventIsOutOfDropdown)
    }

    /**
     * Highlights the item that matches the search buffer. To do so it checks the list buttons
     * text content. It highlights items following this priority:
     * - If an element is already highlighted, it starts searching from that element.
     * - If no element is found starting from the previously highlighted, it returns the first one.
     * - If no element is found matching the search query it highlights the first element.
     *
     * @param search - The search string to find in the HTML.
     */
    watch(searchBuffer, search => {
      if (search) {
        const normalizedSearch = normalizeString(search)
        const matchingIndices = itemsButtonRefs?.value?.reduce<number[]>(
          (matchingIndices, button, index) => {
            const safeButtonWordCharacters = button.textContent!.replace(/\W/g, '')
            const normalizedButtonText = normalizeString(safeButtonWordCharacters)
            if (normalizedButtonText.startsWith(normalizedSearch)) {
              matchingIndices.push(index)
            }
            return matchingIndices
          },
          [],
        )
        highlightedItemIndex.value =
          // First matching item starting to search from the current highlighted element
          matchingIndices?.find(index => index >= highlightedItemIndex.value) ??
          // First matching item
          matchingIndices?.[0] ??
          // First item
          0
      }
    })

    /**
     * Updates the debounced function to reset the search.
     *
     * @param searchTimeoutMs - The new milliseconds that have to pass without typing before
     * resetting the search.
     */
    watch(
      () => props.searchTimeoutMs,
      searchTimeoutMs => {
        restartResetSearchTimeout = debounceFunction(resetSearchBuffer, searchTimeoutMs)
      },
      { immediate: true },
    )

    /**
     * Focuses the DOM element which matches the `highlightedItemIndex`.
     *
     * @param highlightedItemIndex - The index of the HTML element to focus.
     */
    watch(
      highlightedItemIndex,
      highlightedItemIndex => {
        nextTick(() => itemsButtonRefs.value[highlightedItemIndex]?.focus())
      },
      { immediate: true },
    )

    /**
     * When the dropdown is open it sets the focused element to the one that is selected.
     *
     * @param isOpen - True if the dropdown is open, false otherwise.
     */
    watch(isOpen, isOpen => {
      highlightedItemIndex.value = isOpen
        ? props.modelValue === null
          ? 0
          : props.items.indexOf(props.modelValue)
        : -1
    })

    /**
     * Adds and removes listeners to close the dropdown when it loses the focus.
     *
     * @param isOpen - True if the dropdown is open, false otherwise.
     */
    watch(isOpen, isOpen => {
      /*
       * Because there is an issue with Firefox in macOS and Safari that doesn't focus the target
       * element of the `mousedown` events, the `focusout` event `relatedTarget` property can't be
       * used to detect whether the user has blurred the dropdown. The hack here is to use
       * document listeners that have the side effect of losing the focus.
       */
      if (isOpen) {
        addDocumentCloseListeners()
      } else {
        removeDocumentCloseListeners()
      }
    })

    /**
     * If the dropdown is destroyed before removing the document listeners, it ensures that they
     * are removed too.
     */
    onBeforeUnmount(() => {
      removeDocumentCloseListeners()
    })

    return {
      hasToggleSlot: !!slots.toggle,
      closeAndFocusToggleButton,
      dropdownCSSClasses,
      emitSelectedItemChanged,
      highlightFirstItem,
      highlightLastItem,
      highlightNextItem,
      highlightPreviousItem,
      highlightedItemIndex,
      isOpen,
      itemsButtonRefs,
      itemsCSSClasses,
      listId,
      open,
      rootRef,
      toggle,
      toggleButtonRef,
      updateSearchBuffer,
    }
  },
})
</script>

<style lang="css" scoped>
.x-dropdown {
  position: relative;
}

.x-dropdown__items-list {
  z-index: 1;
  list-style: none;
  position: absolute;
  padding: 0;
  margin: 0;
  top: calc(100% + var(--x-size-gap-dropdown-default, 0));
}
</style>

<docs lang="mdx">
## Example

The `Dropdown` component is a simple yet customizable select component. The component needs to work
with the list of items available to select, which are passed using the `items` prop, and the selected
item, which is passed in using the `value` prop.

The supported items must be an array that can contain unique strings, unique numbers, or objects
with a unique `id` property.

The content of each item can be customized using the `item` slot, which apart from the data of the
item, it also receives via prop if the element is selected or highlighted.

The `toggle` slot can be used to customize the button that opens the dropdown. If this is not
provided, the `item` slot will be used for that.

```vue
<template>
  <BaseDropdown v-model="value" :items="items">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}️</template>
    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseDropdown>
</template>

<script setup>
import { BaseDropdown } from '@empathyco/x-components'
import { ref } from 'vue'
const items = ['a', 2, { id: '3' }]
const value = ref('a')
</script>
```
</docs>
