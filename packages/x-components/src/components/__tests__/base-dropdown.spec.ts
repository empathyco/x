import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import BaseDropdown from '../base-dropdown.vue';
import { getDataTestSelector } from '../../__tests__/utils';

type Key = 'End' | 'Home' | 'ArrowUp' | 'ArrowDown' | 'Enter' | 'Space' | 'Esc';

function renderDropdown({
  template = `
    <BaseDropdown :modelValue="value" :items="items" @update:modelValue="val => value = val">
      <template #item="{ item, isSelected, isHighlighted }">
        <span>
          {{ item && item.id ? item.id : item }}
        </span>
      </template>
    </BaseDropdown>`,
  items = ['one', 'two', 'three'],
  initialValue = items[0]
}: Partial<{ template?: string; items?: any[]; initialValue?: any }> = {}) {
  const wrapper = mount(
    {
      template,
      components: { BaseDropdown },
      props: ['items'],
      data: () => ({ value: initialValue })
    },
    {
      props: { items }
    }
  );

  const dropdown = wrapper.findComponent(BaseDropdown);

  const getDropdownToggle = () => dropdown.find(getDataTestSelector('dropdown-toggle'));
  const getListItems = () => dropdown.findAll(getDataTestSelector('dropdown-item'));
  const getHighlightedItem = () => dropdown.find('.x-dropdown__item--is-highlighted');
  const getSelectedItem = () => dropdown.find('.x-dropdown__item--is-selected');

  function clickBody() {
    document.dispatchEvent(new Event('mousedown'));
    return nextTick();
  }

  const clickToggleButton = () => getDropdownToggle().trigger('click');
  const clickNthItem = (nth: number) => getListItems().at(nth)?.trigger('click');
  const pressKeyFromToggle = (key: Key) => getDropdownToggle().trigger(`keydown`, { key });
  const pressKeyFromFocusedItem = (key: Key) => getHighlightedItem().trigger(`keydown`, { key });

  async function search(search: string) {
    jest.useFakeTimers();
    await chainTypeChars(search, nextTick());
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
             * are always executed every time a `keydown` event is emitted. That's why the only
             * way to make it work is to pass the real key value in the options.
             * The `keydown.<key>` syntax of the `trigger` method can't be used. */
            getHighlightedItem().trigger('keydown', { key: charToType })
          )
        )
      : previousCharPromise;
  }

  function isListVisible() {
    const element = dropdown.find(getDataTestSelector('dropdown-list')).element as HTMLElement;
    return element.style.display !== 'none';
  }

  return {
    wrapper: dropdown,
    getDropdownToggle,
    getListItems,
    getHighlightedItem,
    getSelectedItem,
    clickBody,
    clickToggleButton,
    clickNthItem,
    pressKeyFromToggle,
    pressKeyFromFocusedItem,
    search,
    isListVisible
  } as const;
}

describe('testing Dropdown component', () => {
  it('does not render the list if it is collapsed', async () => {
    const { getDropdownToggle, clickToggleButton, isListVisible } = renderDropdown();

    expect(getDropdownToggle().exists()).toBeTruthy();
    expect(isListVisible()).toBeFalsy();

    await clickToggleButton();

    expect(isListVisible()).toBeTruthy();
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
      expect(listItemWrappers.at(index)?.text()).toBe(typeof item === 'string' ? item : item.id);
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
        <BaseDropdown :modelValue="value" :items="items" @update:modelValue="val => value = val">
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
    expect(getHighlightedItem().text()).toBe(listItemWrappers.at(0)?.text());
    expect(getSelectedItem().exists()).toBeFalsy();
  });

  it('allows to customize the toggle button', async () => {
    const { clickToggleButton, getDropdownToggle } = renderDropdown({
      template: `
        <BaseDropdown :modelValue="value" :items="items" @update:modelValue="val => value = val">
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
    const items = ['stones', 'go', 'bum'];
    const selectedIndex = 1;

    it('opens and focuses the selected element when the button has focus and the arrow DOWN key is pressed', async () => {
      const { pressKeyFromToggle, getHighlightedItem, getListItems } = renderDropdown({
        items,
        initialValue: items[selectedIndex]
      });

      await pressKeyFromToggle('ArrowDown');

      const selectedElement = getListItems().at(selectedIndex);
      expect(getHighlightedItem().text()).toBe(selectedElement?.text());
    });

    it('opens and focuses the selected element when the button has focus and arrow UP key is pressed', async () => {
      const { pressKeyFromToggle, getHighlightedItem, getListItems } = renderDropdown({
        items,
        initialValue: items[selectedIndex]
      });

      await pressKeyFromToggle('ArrowUp');

      const selectedElement = getListItems().at(selectedIndex);
      expect(getHighlightedItem().text()).toBe(selectedElement?.text());
    });
  });

  describe('closing the dropdown', () => {
    it('closes the dropdown when it is open and the toggle button is clicked', async () => {
      const { clickToggleButton, isListVisible } = renderDropdown();

      await clickToggleButton();
      expect(isListVisible()).toBeTruthy();

      await clickToggleButton();
      expect(isListVisible()).toBeFalsy();
    });

    it('closes the dropdown when losing focus', async () => {
      const { clickToggleButton, getListItems, clickBody, isListVisible } = renderDropdown();

      await clickToggleButton();
      expect(getListItems()).not.toHaveLength(0);

      await clickBody();
      expect(isListVisible()).toBeFalsy();
    });

    it('closes the dropdown when selecting an element', async () => {
      const items = [0, 1, 2, 3, 4];
      const value = items[0];
      const { clickNthItem, clickToggleButton, getDropdownToggle, isListVisible } = renderDropdown({
        items,
        initialValue: value
      });

      await clickToggleButton();
      await clickNthItem(2);

      expect(getDropdownToggle().text()).toEqual('2');
      expect(isListVisible()).toBeFalsy();
    });

    it('closes the dropdown without modifying the selected item when the escape key is pressed', async () => {
      const {
        getHighlightedItem,
        clickToggleButton,
        pressKeyFromFocusedItem,
        getSelectedItem,
        isListVisible
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
      expect(isListVisible()).toBeFalsy();

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

    it('focuses the first element when the home button is pressed and the last when the end key is pressed', async () => {
      const { pressKeyFromFocusedItem, clickToggleButton, getListItems, getHighlightedItem } =
        renderDropdown();

      await clickToggleButton();
      const listItems = getListItems();

      await pressKeyFromFocusedItem('End');
      expect(getHighlightedItem().text()).toBe(listItems.at(-1)?.text());

      await pressKeyFromFocusedItem('Home');
      expect(getHighlightedItem().text()).toBe(listItems.at(0)?.text());
    });

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
