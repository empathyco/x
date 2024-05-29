import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { SearchInput } from '../../x-modules/search-box/components/index';
import { installNewXPlugin } from '../../__tests__/utils';
import BaseKeyboardNavigation from '../base-keyboard-navigation.vue';
import { DirectionalFocusNavigationService } from '../../services/directional-focus-navigation.service';

describe('testing keyboard navigation component', () => {
  let localVue: typeof Vue;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
  });

  it('takes control of the navigation when a defined condition is triggered', () => {
    const navigateToSpy = jest.spyOn(
      DirectionalFocusNavigationService.prototype as any,
      'navigateTo'
    );
    const searchInput = mount(SearchInput, { localVue });
    mount(BaseKeyboardNavigation, {
      localVue,
      propsData: {
        navigationHijacker: [
          {
            xEvent: 'UserPressedArrowKey',
            moduleName: 'searchBox',
            direction: 'ArrowDown'
          }
        ]
      }
    });
    searchInput.trigger('keydown', { key: 'ArrowUp' });
    expect(navigateToSpy).not.toHaveBeenCalled();

    searchInput.trigger('keydown', { key: 'ArrowDown' });
    expect(navigateToSpy).toHaveBeenCalled();
  });

  it('emits the defined event when reaching the limit in the direction of the navigation', () => {
    const listener = jest.fn();
    // As cannot mock elementToFocus (it will be undefined), making the navigateTo method return undefined
    jest
      .spyOn(DirectionalFocusNavigationService.prototype as any, 'navigateTo')
      .mockReturnValue(undefined);
    const keyboardNavigation = mount(BaseKeyboardNavigation, {
      localVue,
      propsData: {
        takeNavigationControl: [],
        eventsForDirectionLimit: {
          ArrowUp: 'UserReachedEmpathizeTop'
        }
      }
    });
    keyboardNavigation.vm.$x.on('UserReachedEmpathizeTop').subscribe(listener);
    keyboardNavigation.trigger('keydown', { key: 'ArrowUp' });

    expect(listener).toHaveBeenCalled();
  });
});
