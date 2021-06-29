import { Identifiable } from '@empathy/search-types';
import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import BaseDropdown from '../base-dropdown.vue';
import { getDataTestSelector } from '../../__tests__/utils';

function renderDropdown({
  template = `
    <BaseDropdown v-model="value" :items="items">
        <template #item="{ item, isSelected, isHighlighted }">
            <span>
              {{ item && item.id ? item.id : item }}
            </span>
        </template>
    </BaseDropdown>`,
  items = ['one', 'two', 'three'],
  initialValue = items[0]
}: RenderDropdownOptions = {}): RenderDropdownAPI {
  const wrapper = mount(
    {
      props: ['items'],
      components: {
        BaseDropdown
      },
      template,
      data() {
        return {
          value: initialValue
        };
      }
    },
    {
      propsData: {
        items
      }
    }
  );

  const dropdownWrapper = wrapper.findComponent(BaseDropdown);

  function getDropdownToggle(): Wrapper<Vue> {
    return dropdownWrapper.find(getDataTestSelector('dropdown-toggle'));
  }

  function getListItems(): WrapperArray<Vue> {
    return dropdownWrapper.findAll(getDataTestSelector('dropdown-item'));
  }

  function getHighlightedItem(): Wrapper<Vue> {
    return dropdownWrapper.find('.x-dropdown__item--is-highlighted');
  }

  function getSelectedItem(): Wrapper<Vue> {
    return dropdownWrapper.find('.x-dropdown__item--is-selected');
  }

  function clickBody(): Promise<void> {
    document.dispatchEvent(new Event('mousedown'));
    return dropdownWrapper.vm.$nextTick();
  }

  function clickToggleButton(): Promise<void> {
    getDropdownToggle().trigger('click');
    return dropdownWrapper.vm.$nextTick();
  }

  function clickNthItem(nth: number): Promise<void> {
    getListItems().at(nth).trigger('click');
    return dropdownWrapper.vm.$nextTick();
  }

  function pressKeyFromToggle(key: Key): Promise<void> {
    const keyDownEventInit: KeyboardEventInit = {
      key
    };
    getDropdownToggle().trigger(`keydown`, keyDownEventInit);
    return dropdownWrapper.vm.$nextTick();
  }

  function pressKeyFromFocusedItem(key: Key): Promise<void> {
    const keyDownEventInit: KeyboardEventInit = {
      key
    };
    getHighlightedItem().trigger(`keydown`, keyDownEventInit);
    return dropdownWrapper.vm.$nextTick();
  }

  async function search(search: string): Promise<void> {
    jest.useFakeTimers();
    await chainTypeChars(search, dropdownWrapper.vm.$nextTick());
    jest.runAllTimers();
    jest.useRealTimers();
  }

  function chainTypeChars(search: string, previousCharPromise: Promise<void>): Promise<void> {
    const charToType = search[0];
    const pendingChars = search.substring(1);
    return charToType
      ? chainTypeChars(
          pendingChars,
          previousCharPromise.then(() =>
            /* Vue test utils has a strange issue where the `home` and `end` event handlers
             * are always executed every time a `keydown` event is emmitted. That's why the only
             * way to make it work is to pass the real key value in the options.
             * The `keydown.<key>` syntax of the `trigger` method can't be used. */
            getHighlightedItem().trigger('keydown', { key: charToType })
          )
        )
      : previousCharPromise;
  }

  return {
    wrapper: dropdownWrapper,
    getDropdownToggle,
    getListItems,
    getHighlightedItem,
    getSelectedItem,
    clickBody,
    clickToggleButton,
    clickNthItem,
    pressKeyFromToggle,
    pressKeyFromFocusedItem,
    search
  };
}

describe('testing Dropdown component', () => {
  it('does not render the list if it is collapsed', async () => {
    const { getDropdownToggle, getListItems, clickToggleButton } = renderDropdown();

    expect(getDropdownToggle().exists()).toBe(true);
    expect(getListItems().exists()).toBe(false);

    await clickToggleButton();

    expect(getListItems().exists()).toBe(true);
  });

  it('renders the provided items', async () => {
    const items = ['one', 'two', { id: 'three' }, { id: 'four' }];
    const value = items[0];
    const { getListItems, clickToggleButton } = renderDropdown({
      items,
      initialValue: value
    });

    await clickToggleButton();

    const listItemWrappers = getListItems();
    expect(listItemWrappers).toHaveLength(4);
    items.forEach((item, index) => {
      expect(listItemWrappers.at(index).text()).toBe(typeof item === 'string' ? item : item.id);
    });
  });

  it('allows not having a selected item using `null` as value', async () => {
    const {
      getListItems,
      clickToggleButton,
      getSelectedItem,
      getDropdownToggle,
      getHighlightedItem
    } = renderDropdown({
      template: `
        <BaseDropdown v-model="value" :items="items">
            <template #toggle="{ item }">
              {{ item || 'select something'}}
            </template>
        </BaseDropdown>`,
      initialValue: null
    });

    expect(getDropdownToggle().text()).toBe('select something');
    await clickToggleButton();

    const listItemWrappers = getListItems();
    expect(getDropdownToggle().text()).toBe('select something');
    expect(listItemWrappers.length).toBeGreaterThan(0);
    expect(getHighlightedItem().text()).toBe(listItemWrappers.at(0).text());
    expect(getSelectedItem().element).toBeUndefined();
  });

  it('allows to customize the toggle button', async () => {
    const { clickToggleButton, getDropdownToggle } = renderDropdown({
      template: `
        <BaseDropdown v-model="value" :items="items">
            <template #toggle="{ item, isOpen }">
              {{ item }} {{ isOpen ? '🔼' : '🔽' }}
            </template>
        </BaseDropdown>`
    });

    expect(getDropdownToggle().text()).toEqual('one 🔽');

    await clickToggleButton();

    expect(getDropdownToggle().text()).toEqual('one 🔼');
  });

  describe('opening the dropdown', () => {
    const items = ['stonks', 'go', 'brrr'];
    const selectedIndex = 1;

    // eslint-disable-next-line max-len
    it('opens and focuses the selected element when the button has focus and the arrow DOWN key is pressed', async () => {
      const { pressKeyFromToggle, getHighlightedItem, getListItems } = renderDropdown({
        items,
        initialValue: items[selectedIndex]
      });

      await pressKeyFromToggle('ArrowDown');

      const selectedElement = getListItems().at(selectedIndex);
      expect(getHighlightedItem().text()).toBe(selectedElement.text());
    });

    // eslint-disable-next-line max-len
    it('opens and focuses the selected element when the button has focus and arrow UP key is pressed', async () => {
      const { pressKeyFromToggle, getHighlightedItem, getListItems } = renderDropdown({
        items,
        initialValue: items[selectedIndex]
      });

      await pressKeyFromToggle('ArrowUp');

      const selectedElement = getListItems().at(selectedIndex);
      expect(getHighlightedItem().text()).toBe(selectedElement.text());
    });
  });

  describe('closing the dropdown', () => {
    it('closes the dropdown when it is open and the toggle button is clicked', async () => {
      const { clickToggleButton, getListItems } = renderDropdown();

      await clickToggleButton();
      expect(getListItems().length).toBeGreaterThan(0);

      await clickToggleButton();
      expect(getListItems()).toHaveLength(0);
    });

    it('closes the dropdown when losing focus', async () => {
      const { clickToggleButton, getListItems, clickBody } = renderDropdown();

      await clickToggleButton();
      expect(getListItems()).not.toHaveLength(0);

      await clickBody();
      expect(getListItems()).toHaveLength(0);
    });

    it('closes the dropdown when selecting an element', async () => {
      const items = [0, 1, 2, 3, 4];
      const value = items[0];
      const { clickNthItem, clickToggleButton, getDropdownToggle, getListItems } = renderDropdown({
        items,
        initialValue: value
      });

      await clickToggleButton();
      await clickNthItem(2);

      expect(getDropdownToggle().text()).toEqual('2');
      expect(getListItems()).toHaveLength(0);
    });

    // eslint-disable-next-line max-len
    it('closes the dropdown without modifying the selected item when the escape key is pressed', async () => {
      const {
        getHighlightedItem,
        clickToggleButton,
        pressKeyFromFocusedItem,
        getListItems,
        getSelectedItem
      } = renderDropdown({
        items: ['spain', 'uk', 'poland'],
        initialValue: 'spain'
      });

      await clickToggleButton();
      expect(getSelectedItem().text()).toBe('spain');
      expect(getHighlightedItem().text()).toBe('spain');

      await pressKeyFromFocusedItem('ArrowDown');
      expect(getHighlightedItem().text()).toBe('uk');
      expect(getSelectedItem().text()).toBe('spain');

      await pressKeyFromFocusedItem('Esc');
      expect(getListItems()).toHaveLength(0);

      await clickToggleButton();
      expect(getSelectedItem().text()).toBe('spain');
      expect(getHighlightedItem().text()).toBe('spain');
    });
  });

  describe('focusing items', () => {
    it('navigates the list with the up and down arrow keys', async () => {
      const items = ['relevance', 'price', 'alphabetical'];
      const { pressKeyFromFocusedItem, clickToggleButton, getHighlightedItem } = renderDropdown({
        items
      });

      await clickToggleButton();
      expect(getHighlightedItem().text()).toBe(items[0]);

      await pressKeyFromFocusedItem('ArrowDown');
      expect(getHighlightedItem().text()).toBe(items[1]);

      await pressKeyFromFocusedItem('ArrowDown');
      expect(getHighlightedItem().text()).toBe(items[2]);

      // Loop to the first element
      await pressKeyFromFocusedItem('ArrowDown');
      expect(getHighlightedItem().text()).toBe(items[0]);

      // Loop back to the last element
      await pressKeyFromFocusedItem('ArrowUp');
      expect(getHighlightedItem().text()).toBe(items[2]);
    });

    // eslint-disable-next-line max-len
    it('focuses the first element when the home button is pressed and the last when the end key is pressed', async () => {
      const { pressKeyFromFocusedItem, clickToggleButton, getListItems, getHighlightedItem } =
        renderDropdown();

      await clickToggleButton();
      const listItems = getListItems();

      await pressKeyFromFocusedItem('End');
      expect(getHighlightedItem().text()).toBe(listItems.at(-1).text());

      await pressKeyFromFocusedItem('Home');
      expect(getHighlightedItem().text()).toBe(listItems.at(0).text());
    });

    // eslint-disable-next-line max-len
    it('focuses the first element starting to search from the focused one which its text starts with the typed characters', async () => {
      const { search, getHighlightedItem, clickToggleButton } = renderDropdown({
        items: ['chocolate', 'milk', 'milk chocolate', 'chocolate milk'],
        initialValue: 'chocolate'
      });
      await clickToggleButton();

      await search('mi');
      expect(getHighlightedItem().text()).toBe('milk');

      await search('choco');
      expect(getHighlightedItem().text()).toBe('chocolate milk');

      await search('milk c');
      expect(getHighlightedItem().text()).toBe('milk chocolate');
    });

    // eslint-disable-next-line max-len
    it('focuses the first element when typing if no element is found starting with the typed chars', async () => {
      const { search, getHighlightedItem, clickToggleButton } = renderDropdown({
        items: ['beer', 'steak'],
        initialValue: 'steak'
      });

      await clickToggleButton();
      expect(getHighlightedItem().text()).toBe('steak');
      await search('wine');
      expect(getHighlightedItem().text()).toBe('beer');
    });
  });
});

type Key = 'End' | 'Home' | 'ArrowUp' | 'ArrowDown' | 'Enter' | 'Space' | 'Esc';

interface RenderDropdownOptions {
  /** The template to test. */
  template?: string;
  /** Items to be rendered by the {@link BaseDropdown}. */
  items?: Array<number | string | Identifiable>;
  /** The initial selected value. */
  initialValue?: null | number | string | Identifiable;
}

interface RenderDropdownAPI {
  /** Dropdown test wrapper. */
  wrapper: Wrapper<Vue>;
  /**
   * Retrieves the button wrapper to open the dropdown.
   *
   * @returns The Wrapper to open the dropdown.
   */
  getDropdownToggle: () => Wrapper<Vue>;
  /**
   * Retrieves wrappers of the list item buttons.
   *
   * @returns The wrappers of the list item buttons.
   */
  getListItems: () => WrapperArray<Vue>;
  /**
   * Retrieves the highlighted item wrapper.
   * This can only be used if the dropdown is open.
   *
   * @returns The highlighted item.
   */
  getHighlightedItem: () => Wrapper<Vue>;
  /**
   * Retrieves the selected item wrapper.
   * This can only be used if the dropdown is open.
   *
   * @returns The selected item.
   */
  getSelectedItem: () => Wrapper<Vue>;
  /**
   * Simulates a click event in the body.
   *
   * @returns A promise that resolves after updating the view.
   */
  clickBody: () => Promise<void>;
  /**
   * Simulates a click event in the button that opens the dropdown.
   *
   * @returns A promise that resolves after updating the view.
   */
  clickToggleButton: () => Promise<void>;
  /**
   * Simulates a click event in element with the index passed.
   * To use this, the dropdown must be opened first.
   *
   * @returns A promise that resolves after updating the view.
   */
  clickNthItem: (item: number) => Promise<void>;
  /**
   * Simulates a key press that happens when the dropdown open button is focused.
   *
   * @param key - The key to press.
   * @returns A promise that resolves after updating the view.
   */
  pressKeyFromToggle: (key: Key) => Promise<void>;
  /**
   * Simulates a key press that happens when the an element from the list is focused.
   * To use this, the dropdown must be opened first.
   *
   * @param key - The key to press.
   * @returns A promise that resolves after updating the view.
   */
  pressKeyFromFocusedItem: (key: Key) => Promise<void>;
  /**
   * Searches inside the items for the characters. It emits an event for each character that the
   * passed string has.
   * To use this, the dropdown must be opened first.
   *
   * @param itemText - The text to find inside the items.
   * @returns A promise that resolves after updating the view.
   */
  search: (itemText: string) => Promise<void>;
}
