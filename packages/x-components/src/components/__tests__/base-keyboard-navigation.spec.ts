import { mount } from '@vue/test-utils';
import { SearchInput } from '../../x-modules/search-box/components/index';
import { installNewXPlugin } from '../../__tests__/utils';
import BaseKeyboardNavigation from '../base-keyboard-navigation.vue';
import { DirectionalFocusNavigationService } from '../../services/directional-focus-navigation.service';
import { XPlugin } from '../../plugins/x-plugin';

describe('testing keyboard navigation component', () => {
  it('takes control of the navigation when a defined condition is triggered', () => {
    const navigateToSpy = jest.spyOn(
      DirectionalFocusNavigationService.prototype as any,
      'navigateTo'
    );
    mount(BaseKeyboardNavigation, {
      global: { plugins: [installNewXPlugin()] },
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

    const searchInput = mount(SearchInput);
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
      global: { plugins: [installNewXPlugin()] },
      propsData: {
        eventsForDirectionLimit: {
          ArrowUp: 'UserReachedEmpathizeTop'
        }
      }
    });
    XPlugin.bus.on('UserReachedEmpathizeTop').subscribe(listener);
    keyboardNavigation.trigger('keydown', { key: 'ArrowUp' });

    expect(listener).toHaveBeenCalled();
  });
});
