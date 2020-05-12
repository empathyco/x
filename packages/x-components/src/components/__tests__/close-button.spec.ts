import { mount } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import CloseButton from '../close-button.vue';

describe('testing Close Button component', () => {
  const [, localVue] = installNewXPlugin();

  const component = mount(CloseButton, {
    localVue
  });

  it('emits UserClosedX XEvent when clicked', () => {
    const listener = jest.fn();

    component.vm.$x.on('UserClosedX').subscribe(listener);
    component.trigger('click');

    expect(listener).toHaveBeenCalled();
  });

  it('checks the default slot content is the expected', () => {
    const defaultContent = component.vm.$x.config.messages.closeButton.content;
    expect(component.text()).toEqual(defaultContent);
  });

  it('renders the content overriding default slot', () => {
    const overriddenSlotComponent = mount(CloseButton, {
      localVue,
      slots: {
        default: [
          { template: '<img src="./close-button-icon.svg" data-test="close-button-icon" />' },
          { template: '<span>Close</span>' }
        ]
      }
    });

    expect(
      overriddenSlotComponent.find(getDataTestSelector('close-button-icon')).element
    ).toBeDefined();
    expect(overriddenSlotComponent.text()).toEqual('Close');
  });
});
