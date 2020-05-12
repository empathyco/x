import { mount } from '@vue/test-utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import KeyboardNavigation from '../keyboard-navigation.vue';

describe('testing keyboard navigation component', () => {
  const [, localVue] = installNewXPlugin();
  const keyboardNavigationWrapper = mount(KeyboardNavigation, { localVue });

  it('is an XComponent and has an XModule', () => {
    expect(isXComponent(keyboardNavigationWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(keyboardNavigationWrapper.vm)).toBe('empathize');
  });

  it('emits UserPressedArrowKey when an arrow key is pressed', () => {
    const listener = jest.fn();

    keyboardNavigationWrapper.vm.$x.on('UserPressedArrowKey').subscribe(listener);
    keyboardNavigationWrapper.trigger('keydown', { key: 'ArrowDown' });

    expect(listener).toHaveBeenCalledWith('ArrowDown');
  });

  it('emits UserPressedArrowKey when an arrow key is pressed in an inner element', () => {
    const wrapperComponent = {
      template: `
        <KeyboardNavigation>
          <button data-test="focusable-element">Query suggestion</button>
        </KeyboardNavigation>
      `,
      components: {
        KeyboardNavigation
      }
    };

    const listener = jest.fn();
    const keyboardNavigationCustomWrapper = mount(wrapperComponent, {
      localVue
    });
    keyboardNavigationWrapper.vm.$x.on('UserPressedArrowKey').subscribe(listener);

    keyboardNavigationCustomWrapper
      .find(getDataTestSelector('focusable-element'))
      .trigger('keydown', { key: 'ArrowDown' });

    expect(listener).toHaveBeenCalledWith('ArrowDown');
  });
});
