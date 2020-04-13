import { createLocalVue, mount } from '@vue/test-utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import ClearSearchInput from '../clear-search-input.vue';

describe('testing ClearSearchInput component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });

  it('emits UserPressedClearSearchBoxButton when clicked', () => {
    const listener = jest.fn();
    const clearSearchInput = mount(ClearSearchInput, { localVue });
    clearSearchInput.vm.$x.on('UserPressedClearSearchBoxButton', true).subscribe(listener);

    clearSearchInput.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: undefined,
      metadata: {
        moduleName: 'searchBox',
        target: clearSearchInput.element
      }
    });
  });

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-clear-search-input__text">Clear</span>';
    const clearSearchInput = mount(ClearSearchInput, {
      localVue,
      slots: {
        default: {
          template: slotTemplate
        }
      }
    });
    const rederedSlotHTML = clearSearchInput.element.querySelector('.x-clear-search-input__text');

    expect(rederedSlotHTML).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(rederedSlotHTML!.textContent).toEqual('Clear');
  });
});
