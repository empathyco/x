<template>
  <div
    @keydown="updateSearchBuffer"
    @keydown.down.prevent="highlightNextItem"
    @keydown.up.prevent="highlightPreviousItem"
    :class="dropdownCSSClasses"
    class="x-dropdown"
  >
    <button
      ref="toggleButton"
      @click="toggle"
      @keydown.up.down.prevent.stop="open"
      class="x-dropdown__toggle"
      data-test="dropdown-toggle"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen.toString()"
      :aria-controls="listId"
      :aria-label="ariaLabel"
      aria-autocomplete="none"
    >
      <!--
       @slot Used to render the contents of the dropdown toggle button. If not provided, it uses
       the item slot as fallback.
       @binding {string|number|Identifiable} item - The item data to render.
       @binding {boolean} isOpen - True if the dropdown is opened, and false if it is closed.
     -->
      <slot v-if="$scopedSlots.toggle" :isOpen="isOpen" :item="value" name="toggle">
        {{ value }}
      </slot>
      <slot v-else :item="value" name="item">{{ value }}</slot>
    </button>

    <component :is="animation">
      <ul
        v-show="isOpen"
        @keydown.end="highlightLastItem"
        @keydown.esc="closeAndFocusToggleButton"
        @keydown.home="highlightFirstItem"
        :id="listId"
        class="x-dropdown__items-list"
        role="listbox"
        tabindex="-1"
      >
        <li v-for="(item, index) in items" :key="item.id || item" class="x-dropdown__list-item">
          <button
            ref="itemButtons"
            @click="emitSelectedItemChanged(item)"
            :aria-selected="(item === value).toString()"
            :class="itemsCSSClasses[index]"
            class="x-dropdown__item"
            data-test="dropdown-item"
            role="option"
          >
            <!--
               @slot (required) Used to render each one of the items content, and as fallback
               for the toggle button content slot if it is not provided.
               @binding {string|number|Identifiable} item - Item to render
               @binding {boolean} isHighlighted - True when the item has the focus.
               @binding {boolean} isSelected - True when the item is selected.
             -->
            <slot
              :isHighlighted="index === highlightedItemIndex"
              :isSelected="item === value"
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
  import { Identifiable } from '@empathyco/x-types';
  import {
    defineComponent,
    PropType,
    computed,
    ref,
    watch,
    nextTick,
    isReadonly,
    onBeforeUnmount,
    Ref
  } from 'vue';
  import { getTargetElement } from '../utils/html';
  import { normalizeString } from '../utils/normalize';
  import { isInRange } from '../utils/number';
  import { debounce } from '../utils/debounce';
  import { VueCSSClasses } from '../utils/types';
  import { AnimationProp } from '../types/index';
  import { NoElement } from './no-element';

  type DropdownItem = Identifiable;

  /**
   * Dropdown component that mimics a Select element behavior, but with the option
   * to customize the toggle button and each item contents.
   *
   * @public
   */
  export default defineComponent({
    components: {
      NoElement
    },
    model: {
      event: 'change'
    },
    props: {
      /**
       * List of items to display.
       *
       * @public
       */
      items: {
        type: Array as PropType<DropdownItem[]>,
        required: true
      },
      /**
       * Description of what the dropdown is used for.
       *
       * @public
       */
      ariaLabel: {
        type: String
      },
      /**
       * The selected item.
       *
       * @public
       */
      value: {
        type: [String, Number, Object] as PropType<DropdownItem>,
        required: true
      },
      /**
       * Animation component to use for expanding the dropdown. This is a single element animation,
       * so only `<transition>` components are allowed.
       *
       * @public
       */
      animation: {
        type: AnimationProp,
        default: 'NoElement'
      },
      /**
       * Time to wait without receiving any keystroke before resetting the items search query.
       *
       * @public
       */
      searchTimeoutMs: {
        type: Number,
        default: 1000
      }
    },
    setup(props, { emit }) {
      let dropdownCount = 0;

      /** Array containing the dropdown list buttons HTMLElements. */
      const itemButtons = ref<HTMLButtonElement[] | null>(null);

      /** The button that opens and closes the list of options. */
      const toggleButton = ref<HTMLButtonElement | null>(null);

      /**
       * Property to track whether the dropdown is expanded and displaying the full
       * list of items, or closed.
       *
       * @internal
       */
      let isOpen: Ref<boolean> = ref(false);

      /**
       * Index of the element that has the focus in the list. -1 means no element has focus.
       *
       * @internal
       */
      let highlightedItemIndex: Ref<number> = ref(-1);
      /**
       * String to search for the first element that starts with it.
       *
       * @internal
       */
      let searchBuffer: Ref<string> = ref('');

      /**
       * Resets the search buffer after a certain time has passed.
       *
       * @internal
       */
      let restartResetSearchTimeout!: () => void;

      const listId = `x-dropdown-${dropdownCount++}`;

      isReadonly(listId);

      /**
       * Dynamic CSS classes to add to the dropdown root element.
       *
       * @returns An object containing the CSS classes to add to the dropdown root element.
       * @internal
       */
      const dropdownCSSClasses = computed<VueCSSClasses>(() => {
        return {
          'x-dropdown--is-open': isOpen.value
        };
      });

      /**
       * Dynamic CSS classes to add to each one of the items.
       *
       * @returns An object containing the CSS classes to add to each item.
       * @internal
       */
      const itemsCSSClasses = computed<VueCSSClasses[]>(() => {
        return props.items.map((item, index) => {
          return {
            'x-dropdown__item--is-selected': props.value === item,
            'x-dropdown__item--is-highlighted': highlightedItemIndex.value === index
          };
        });
      });

      /**
       * Closes the dropdown.
       *
       * @internal
       */
      const close = (): void => {
        isOpen.value = false;
      };

      /**
       * Closes the dropdown if the passed event has happened on an element out of the dropdown.
       *
       * @param event - The event to check if it has happen out of the dropdown component.
       */
      const el = ref<HTMLElement | null>();
      const closeIfEventIsOutOfDropdown = (event: MouseEvent | TouchEvent | FocusEvent): void => {
        if (!el.value!.contains(getTargetElement(event))) {
          close();
        }
      };

      /**
       * Removes the listeners of the document element to detect if the focus has moved out from the
       * dropdown.
       *
       * @internal
       */
      const removeDocumentCloseListeners = (): void => {
        /* eslint-disable @typescript-eslint/unbound-method */
        document.removeEventListener('mousedown', closeIfEventIsOutOfDropdown);
        document.removeEventListener('touchstart', closeIfEventIsOutOfDropdown);
        document.removeEventListener('focusin', closeIfEventIsOutOfDropdown);
        /* eslint-enable @typescript-eslint/unbound-method */
      };

      /**
       * If the dropdown is destroyed before removing the document listeners, it ensures that they
       * are removed too.
       *
       * @internal
       */
      onBeforeUnmount((): void => removeDocumentCloseListeners());

      /**
       * Opens the dropdown.
       *
       * @internal
       */
      const open = (): void => {
        isOpen.value = true;
      };

      /**
       * Closes the modal and focuses the toggle button.
       *
       * @internal
       */
      const closeAndFocusToggleButton = (): void => {
        close();
        toggleButton.value!.focus();
      };

      /**
       * If the dropdown is opened it closes it. If it is closed it opens it.
       *
       * @internal
       */
      const toggle = (): void => {
        isOpen.value = !isOpen.value;
      };

      /**
       * Emits the event that the selected item has changed.
       *
       * @param item - The new selected item.
       * @internal
       */
      const emitSelectedItemChanged = (item: DropdownItem): void => {
        emit('change', item);
        closeAndFocusToggleButton();
      };

      /**
       * Highlights the item after the one that is currently highlighted.
       *
       * @internal
       */
      const highlightNextItem = (): void => {
        open();
        highlightedItemIndex.value = (highlightedItemIndex.value + 1) % props.items.length;
      };

      /**
       * Highlights the item before the one that is currently highlighted.
       *
       * @internal
       */
      const highlightPreviousItem = (): void => {
        open();
        highlightedItemIndex.value =
          highlightedItemIndex.value > 0 ? highlightedItemIndex.value - 1 : props.items.length - 1;
      };

      /**
       * Highlights the first of the provided items.
       *
       * @internal
       */
      const highlightFirstItem = (): void => {
        highlightedItemIndex.value = 0;
      };

      /**
       * Highlights the last of the provided items.
       *
       * @internal
       */
      const highlightLastItem = (): void => {
        highlightedItemIndex.value = props.items.length - 1;
      };

      /**
       * Updates the variable that is used to search in the filters.
       *
       * @param event - The event coming from the user typing.
       * @internal
       */
      const updateSearchBuffer = (event: KeyboardEvent): void => {
        if (/^\w$/.test(event.key)) {
          const key = event.key;
          searchBuffer.value += key;
          restartResetSearchTimeout();
        }
      };

      /**
       * Highlights the item that matches the search buffer. To do so it checks the list buttons
       * text content. It highlights items following this priority:
       * - If an element is already highlighted, it starts searching from that element.
       * - If no element is found starting from the previously highlighted, it returns the
       * first one.
       * - If no element is found matching the search query it highlights the first element.
       *
       * @param search - The search string to find in the HTML.
       * @internal
       */
      watch(
        () => searchBuffer.value,
        (search: string): void => {
          if (search) {
            const normalizedSearch = normalizeString(search);
            const matchingIndices = itemButtons.value!.reduce<number[]>(
              (matchingIndices, button, index) => {
                const safeButtonWordCharacters = button.textContent!.replace(/[^\w]/g, '');
                const normalizedButtonText = normalizeString(safeButtonWordCharacters);
                if (normalizedButtonText.startsWith(normalizedSearch)) {
                  matchingIndices.push(index);
                }
                return matchingIndices;
              },
              []
            );
            highlightedItemIndex.value =
              // First matching item starting to search from the current highlighted element
              matchingIndices.find(index => index >= highlightedItemIndex.value) ??
              // First matching item
              matchingIndices[0] ??
              // First item
              0;
          }
        }
      );

      /**
       * Resets the search buffer.
       *
       * @internal
       */
      const resetSearch = (): void => {
        searchBuffer.value = '';
      };

      /**
       * Updates the debounced function to reset the search.
       *
       * @param searchTimeoutMs - The new milliseconds that have to pass without typing before
       * resetting the search.
       * @internal
       */
      watch(
        () => props.searchTimeoutMs,
        (searchTimeoutMs: number): void => {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          restartResetSearchTimeout = debounce(resetSearch, searchTimeoutMs);
        },
        { immediate: true }
      );

      /**
       * Focuses the DOM element which matches the `highlightedItemIndex`.
       *
       * @param highlightedItemIndex - The index of the HTML element to focus.
       * @internal
       */
      watch(
        () => highlightedItemIndex.value,
        (highlightedItemIndex: number): void => {
          nextTick(() => {
            if (itemButtons && isInRange(highlightedItemIndex, [0, props.items.length - 1])) {
              const newItem = itemButtons.value![highlightedItemIndex];
              newItem.focus();
            }
          });
        },
        { immediate: true }
      );

      /**
       * When the dropdown is open it sets the focused element to the one that is selected.
       *
       * @param isOpen - True if the dropdown is open, false otherwise.
       * @internal
       */
      watch(
        () => isOpen.value,
        (isOpen: boolean): void => {
          if (isOpen) {
            highlightedItemIndex.value =
              props.value === null ? 0 : props.items.indexOf(props.value!);
          } else {
            highlightedItemIndex.value = -1;
          }
        }
      );

      /**
       * Adds listeners to the document element to detect if the focus has moved out from the
       * dropdown.
       *
       * @internal
       */
      const addDocumentCloseListeners = (): void => {
        /* eslint-disable @typescript-eslint/unbound-method */
        document.addEventListener('mousedown', closeIfEventIsOutOfDropdown);
        document.addEventListener('touchstart', closeIfEventIsOutOfDropdown);
        document.addEventListener('focusin', closeIfEventIsOutOfDropdown);
        /* eslint-enable @typescript-eslint/unbound-method */
      };

      /**
       * Adds and removes listeners to close the dropdown when it loses the focus.
       *
       * @param isOpen - True if the dropdown is open, false otherwise.
       * @internal
       */
      watch(
        () => isOpen.value,
        (isOpen: boolean): void => {
          /*
           * Because there is an issue with Firefox in macOS and Safari that doesn't focus the target
           * element of the `mousedown` events, the `focusout` event `relatedTarget` property can't be
           * used to detect whether or not the user has blurred the dropdown. The hack here is to use
           * document listeners that have the side effect of losing the focus.
           */
          if (isOpen) {
            addDocumentCloseListeners();
          } else {
            removeDocumentCloseListeners();
          }
        }
      );

      return {
        updateSearchBuffer,
        isOpen,
        highlightNextItem,
        highlightPreviousItem,
        dropdownCSSClasses,
        toggle,
        listId,
        highlightLastItem,
        closeAndFocusToggleButton,
        highlightFirstItem,
        emitSelectedItemChanged,
        itemsCSSClasses,
        highlightedItemIndex,
        el
      };
    }
  });
</script>

<style lang="scss" scoped>
  .x-dropdown {
    position: relative;

    &__items-list {
      z-index: 1;
      list-style: none;
      position: absolute;
      padding: 0;
      margin: 0;
      top: calc(100% + var(--x-size-gap-dropdown-default, 0));
    }
  }
</style>

<docs lang="mdx">
## Example

The `Dropdown` component is a simple yet customizable select component. The component needs to work
the list of items available to select, which are passed using the `items` prop, and the selected
item, which is passed in using the `value` prop.

The supported items must be an array that can contain unique strings, unique numbers, or objects
with a unique `id` property.

The content of each item can be customized using the `item` slot, which apart from the data of the
item, it also receives via prop if the element is selected or highlighted.

There `toggle` slot can be used to customize the button that opens the dropdown. If this is not
provided, the `item` slot will be used for that.

```vue
<template>
  <BaseDropdown :items="items" v-model="value">
    <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}️</template>

    <template #item="{ item, isSelected, isHighlighted }">
      <span v-if="isHighlighted">🟢</span>
      <span v-if="isSelected">✅</span>
      <span>{{ item }}</span>
    </template>
  </BaseDropdown>
</template>

<script>
  import { BaseDropdown } from '@empathyco/x-components';

  export default {
    name: 'DropdownTest',
    components: {
      BaseDropdown
    },
    data() {
      return {
        items: ['a', 2, { id: '3' }],
        value: ['a']
      };
    }
  };
</script>
```
</docs>
