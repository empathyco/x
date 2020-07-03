import { mount } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseOpenButton from '../base-open-button.vue';

describe('testing open button component', () => {
  const [, localVue] = installNewXPlugin();

  const component = mount(BaseOpenButton, {
    localVue
  });

  it('emits UserOpenedX XEvent when clicked', () => {
    const listener = jest.fn();

    component.vm.$x.on('UserOpenedX').subscribe(listener);
    component.trigger('click');

    expect(listener).toHaveBeenCalled();
  });

  it('checks the default slot content is the expected', () => {
    expect(component.text()).toEqual('');
  });

  it('renders the content overriding default slot', () => {
    const overriddenSlotComponent = mount(BaseOpenButton, {
      localVue,
      slots: {
        default: [
          { template: '<img src="./open-button-icon.svg" data-test="open-button-icon" />' },
          { template: '<span>Open</span>' }
        ]
      }
    });

    expect(
      overriddenSlotComponent.find(getDataTestSelector('open-button-icon')).element
    ).toBeDefined();
    expect(overriddenSlotComponent.text()).toEqual('Open');
  });
});
