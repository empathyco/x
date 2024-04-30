import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { XPlugin } from '../../../../plugins';
import ClearSearchInput from '../clear-search-input.vue';

describe('testing ClearSearchInput component', () => {
  const [, localVue] = installNewXPlugin({});

  it('emits UserPressedClearSearchBoxButton event when clicked', () => {
    const clearSearchInput = mount(ClearSearchInput, { localVue });
    const target = {
      location: 'none',
      moduleName: 'searchBox',
      replaceable: true,
      target: clearSearchInput.element
    };
    const emitSpy = jest.spyOn(XPlugin.bus, 'emit');

    clearSearchInput.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('UserPressedClearSearchBoxButton', undefined, target);
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
    expect(renderedSlotHTML!.textContent).toEqual('Clear');
  });
});
