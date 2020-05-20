import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import ClearSearchInput from '../clear-search-input.vue';

describe('testing ClearSearchInput component', () => {
  const [, localVue] = installNewXPlugin({});

  it('emits UserClearedQuery and UserPressedClearSearchBoxButton when clicked', () => {
    const clearSearchInput = mount(ClearSearchInput, { localVue });
    const target = { target: clearSearchInput.element };
    const spyOn = jest.spyOn(clearSearchInput.vm.$children[0].$x, 'emit');

    clearSearchInput.trigger('click');

    expect(spyOn).toHaveBeenCalledTimes(2);
    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserClearedQuery', undefined, target);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserPressedClearSearchBoxButton', undefined, target);
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
    const renderedSlotHTML = clearSearchInput.element.querySelector('.x-clear-search-input__text');

    expect(renderedSlotHTML).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(renderedSlotHTML!.textContent).toEqual('Clear');
  });
});
