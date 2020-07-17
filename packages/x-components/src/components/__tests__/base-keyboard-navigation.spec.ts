import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { SearchInput } from '../../x-modules/search-box/components/index';
import { installNewXPlugin } from '../../__tests__/utils';
import BaseKeyboardNavigation from '../base-keyboard-navigation.vue';

describe('testing keyboard navigation component', () => {
  let localVue: typeof Vue;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
  });

  it('takes control of the navigation when a defined condition is triggered', () => {
    const mockedFocusNextNavigableElement = jest.fn();
    const searchInput = mount(SearchInput, { localVue });
    const keyboardNavigation = mount(BaseKeyboardNavigation, {
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
    Object.defineProperty(keyboardNavigation.vm, 'focusNextNavigableElement', {
      value: mockedFocusNextNavigableElement
    });
    searchInput.trigger('keydown', { key: 'ArrowUp' });
    expect(mockedFocusNextNavigableElement).not.toHaveBeenCalled();

    searchInput.trigger('keydown', { key: 'ArrowDown' });
    expect(mockedFocusNextNavigableElement).toHaveBeenCalled();
  });

  it('emits the defined event when reaching the limit in the direction of the navigation', () => {
    const listener = jest.fn();
    const htmlElement = document.createElement('div');
    const keyboardNavigation = mount(BaseKeyboardNavigation, {
      localVue,
      data() {
        return {
          elementToFocus: htmlElement
        };
      },
      propsData: {
        takeNavigationControl: [],
        eventsForDirectionLimit: {
          ArrowUp: 'UserReachedEmpathizeTop'
        }
      }
    });
    Object.defineProperty((keyboardNavigation.vm as any).navigationService, 'navigateTo', {
      value: (): HTMLElement => htmlElement
    });
    keyboardNavigation.vm.$x.on('UserReachedEmpathizeTop').subscribe(listener);
    keyboardNavigation.trigger('keydown', { key: 'ArrowUp' });

    expect(listener).toHaveBeenCalled();
  });
});
