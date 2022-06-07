<template>
  <div
    @keydown="updateSearchBuffer"
    @keydown.down.prevent="highlightNextItem"
    @keydown.up.prevent="highlightPreviousItem"
    :class="dropdownCSSClasses"
    class="x-dropdown"
  >
    <button
      @click="toggle"
      @keydown.up.down.prevent.stop="open"
      aria-haspopup="listbox"
      class="x-dropdown__toggle"
      data-test="dropdown-toggle"
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
        v-if="isOpen"
        @keydown.end="highlightLastItem"
        @keydown.esc="close"
        @keydown.home="highlightFirstItem"
        :aria-expanded="isOpen.toString()"
        class="x-dropdown__items-list"
        role="listbox"
        tabIndex="0"
      >
        <li v-for="(item, index) in items" :key="item.id || item" class="x-dropdown__list-item">
          <button
            ref="itemButtons"
            @click="emitSelectedItemChanged(item)"
            :aria-selected="(index === highlightedItemIndex).toString()"
            :aria-current="(item === value).toString()"
            :class="itemsCSSClasses[index]"
            class="x-dropdown__item"
            data-test="dropdown-item"
            role="option"
            tabindex="-1"
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
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import Vue from 'vue';
  import { normalizeString } from '../utils/normalize';
  import { isInRange } from '../utils/number';
  import { debounce } from '../utils/debounce';
  import { VueCSSClasses } from '../utils/types';
  import { NoElement } from './no-element';

  type DropdownItem = string | number | Identifiable;

  /**
   * Dropdown component that mimics a Select element behavior, but with the option
   * to customize the toggle button and each item contents.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    model: {
      event: 'change'
    }
  })
  export default class BaseDropdown extends Vue {
    /**
     * List of items to display.
     *
     * @public
     */
    @Prop({ required: true })
    public items!: DropdownItem[];

    /**
     * The selected item.
     *
     * @public
     */
    @Prop({ required: true })
    public value!: DropdownItem | null;

    /**
     * Animation component to use for expanding the dropdown. This is a single element animation,
     * so only `<transition>` components are allowed.
     *
     * @public
     */
    @Prop({ default: 'NoElement' })
    public animation!: typeof Vue | string;

    /**
     * Time to wait without receiving any keystroke before resetting the items search query.
     *
     * @public
     */
    @Prop({ default: 1000 })
    public searchTimeoutMs!: number;

    public $refs!: {
      /** Array containing the dropdown list buttons HTMLElements. */
      itemButtons: HTMLButtonElement[];
    };

    /**
     * Property to track whether the dropdown is expanded and displaying the full
     * list of items, or closed.
     *
     * @internal
     */
    protected isOpen = false;

    /**
     * Index of the element that has the focus in the list. -1 means no element has focus.
     *
     * @internal
     */
    protected highlightedItemIndex = -1;

    /**
     * String to search for the first element that starts with it.
     *
     * @internal
     */
    protected searchBuffer = '';

    /**
     * Resets the search buffer after a certain time has passed.
     *
     * @internal
     */
    protected restartResetSearchTimeout!: () => void;

    /**
     * Dynamic CSS classes to add to the dropdown root element.
     *
     * @returns An object containing the CSS classes to add to the dropdown root element.
     * @internal
     */
    protected get dropdownCSSClasses(): VueCSSClasses {
      return {
        'x-dropdown--is-open': this.isOpen
      };
    }

    /**
     * Dynamic CSS classes to add to each one of the items.
     *
     * @returns An object containing the CSS classes to add to each item.
     * @internal
     */
    protected get itemsCSSClasses(): VueCSSClasses[] {
      return this.items.map((item, index) => {
        return {
          'x-dropdown__item--is-selected': this.value === item,
          'x-dropdown__item--is-highlighted': this.highlightedItemIndex === index
        };
      });
    }

    /**
     * If the dropdown is destroyed before removing the document listeners, it ensures that they
     * are removed too.
     *
     * @internal
     */
    protected beforeDestroy(): void {
      this.removeDocumentCloseListeners();
    }

    /**
     * Opens the dropdown.
     *
     * @internal
     */
    protected open(): void {
      this.isOpen = true;
    }

    /**
     * Closes the dropdown.
     *
     * @internal
     */
    protected close(): void {
      this.isOpen = false;
    }

    /**
     * If the dropdown is opened it closes it. If it is closed it opens it.
     *
     * @internal
     */
    protected toggle(): void {
      this.isOpen = !this.isOpen;
    }

    /**
     * Emits the event that the selected item has changed.
     *
     * @param item - The new selected item.
     * @internal
     */
    protected emitSelectedItemChanged(item: DropdownItem): void {
      this.$emit('change', item);
      this.close();
    }

    /**
     * Highlights the item after the one that is currently highlighted.
     *
     * @internal
     */
    protected highlightNextItem(): void {
      this.open();
      this.highlightedItemIndex = (this.highlightedItemIndex + 1) % this.items.length;
    }

    /**
     * Highlights the item before the one that is currently highlighted.
     *
     * @internal
     */
    protected highlightPreviousItem(): void {
      this.open();
      this.highlightedItemIndex =
        this.highlightedItemIndex > 0 ? this.highlightedItemIndex - 1 : this.items.length - 1;
    }

    /**
     * Highlights the first of the provided items.
     *
     * @internal
     */
    protected highlightFirstItem(): void {
      this.highlightedItemIndex = 0;
    }

    /**
     * Highlights the last of the provided items.
     *
     * @internal
     */
    protected highlightLastItem(): void {
      this.highlightedItemIndex = this.items.length - 1;
    }

    /**
     * Updates the variable that is used to search in the filters.
     *
     * @param event - The event coming from the user typing.
     * @internal
     */
    protected updateSearchBuffer(event: KeyboardEvent): void {
      if (/^\w$/.test(event.key)) {
        const key = event.key;
        this.searchBuffer += key;
        this.restartResetSearchTimeout();
      }
    }

    /**
     * Highlights the item that matches the search buffer. To do so it checks the list buttons
     * text content. It highlights items folowing this priority:
     * - If an element is already highlighted, it starts searching from that element.
     * - If no element is found starting from the previously highlighted, it returns the first one.
     * - If no element is found matching the search query it highlights the first element.
     *
     * @param search - The search string to find in the HTML.
     * @internal
     */
    @Watch('searchBuffer')
    protected highlightMatchingItem(search: string): void {
      if (search) {
        const normalizedSearch = normalizeString(search);
        const matchingIndices = this.$refs.itemButtons.reduce<number[]>(
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
        this.highlightedItemIndex =
          // First matching item starting to search from the current highlighted element
          matchingIndices.find(index => index >= this.highlightedItemIndex) ??
          // First matching item
          matchingIndices[0] ??
          // First item
          0;
      }
    }

    /**
     * Resets the search buffer.
     *
     * @internal
     */
    protected resetSearch(): void {
      this.searchBuffer = '';
    }

    /**
     * Updates the debounced function to reset the search.
     *
     * @param searchTimeoutMs - The new milliseconds that have to pass without typing before
     * resetting the search.
     * @internal
     */
    @Watch('searchTimeoutMs', { immediate: true })
    protected updateSearchTimeout(searchTimeoutMs: number): void {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.restartResetSearchTimeout = debounce(this.resetSearch, searchTimeoutMs);
    }

    /**
     * Focuses the DOM element which matches the `highlightedItemIndex`.
     *
     * @param highlightedItemIndex - The index of the HTML element to focus.
     * @internal
     */
    @Watch('highlightedItemIndex', { immediate: true })
    protected focusHighlightedItem(highlightedItemIndex: number): void {
      this.$nextTick(() => {
        if (this.$refs.itemButtons && isInRange(highlightedItemIndex, [0, this.items.length - 1])) {
          const newItem = this.$refs.itemButtons[this.highlightedItemIndex];
          newItem.focus();
        }
      });
    }

    /**
     * When the dropdown is open it sets the focused element to the one that is selected.
     *
     * @param isOpen - True if the dropdown is open, false otherwise.
     * @internal
     */
    @Watch('isOpen')
    protected updateHighlightedItem(isOpen: boolean): void {
      if (isOpen) {
        this.highlightedItemIndex = this.value === null ? 0 : this.items.indexOf(this.value);
      } else {
        this.highlightedItemIndex = -1;
      }
    }

    /**
     * Adds and removes listeners to close the dropdown when it loses the focus.
     *
     * @param isOpen - True if the dropdown is open, false otherwise.
     * @internal
     */
    @Watch('isOpen')
    protected syncCloseListeners(isOpen: boolean): void {
      /*
       * Because there is an issue with Firefox in macOS and Safari that doesn't focus the target
       * element of the `mousedown` events, the `focusout` event `relatedTarget` property can't be
       * used to detect whether or not the user has blurred the dropdown. The hack here is to use
       * document listeners that have the side effect of losing the focus.
       */
      if (isOpen) {
        this.addDocumentCloseListeners();
      } else {
        this.removeDocumentCloseListeners();
      }
    }

    /**
     * Adds listeners to the document element to detect if the focus has moved out from the
     * dropdown.
     *
     * @internal
     */
    protected addDocumentCloseListeners(): void {
      /* eslint-disable @typescript-eslint/unbound-method */
      document.addEventListener('mousedown', this.closeIfEventIsOutOfDropdown);
      document.addEventListener('touchstart', this.closeIfEventIsOutOfDropdown);
      document.addEventListener('focusin', this.closeIfEventIsOutOfDropdown);
      /* eslint-enable @typescript-eslint/unbound-method */
    }

    /**
     * Removes the listeners of the document element to detect if the focus has moved out from the
     * dropdown.
     *
     * @internal
     */
    protected removeDocumentCloseListeners(): void {
      /* eslint-disable @typescript-eslint/unbound-method */
      document.removeEventListener('mousedown', this.closeIfEventIsOutOfDropdown);
      document.removeEventListener('touchstart', this.closeIfEventIsOutOfDropdown);
      document.removeEventListener('focusin', this.closeIfEventIsOutOfDropdown);
      /* eslint-enable @typescript-eslint/unbound-method */
    }

    /**
     * Closes the dropdown if the passed event has happened on an element out of the dropdown.
     *
     * @param event - The event to check if it has happen out of the dropdown component.
     */
    protected closeIfEventIsOutOfDropdown(event: MouseEvent | TouchEvent | FocusEvent): void {
      if (!this.$el.contains(event.target as HTMLElement)) {
        this.close();
      }
    }
  }
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
