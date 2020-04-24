import { createLocalVue, mount } from '@vue/test-utils';
import { XPlugin } from '../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../__tests__/adapter.dummy';
import { getDataTestSelector } from '../../__tests__/utils';
import OpenButton from '../open-button.vue';

describe('testing open button component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });

  const component = mount(OpenButton, {
    localVue
  });

  it('emits UserOpenedX XEvent when clicked', () => {
    const listener = jest.fn();

    component.vm.$x.on('UserOpenedX').subscribe(listener);
    component.trigger('click');

    expect(listener).toHaveBeenCalled();
  });

  it('checks the default slot content is the expected', () => {
    const defaultContent = component.vm.$x.config.messages.openButton.content;
    expect(component.text()).toEqual(defaultContent);
  });

  it('renders the content overriding default slot', () => {
    const overriddenSlotComponent = mount(OpenButton, {
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
