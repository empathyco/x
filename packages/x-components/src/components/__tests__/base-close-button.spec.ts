import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../__tests__/utils';
import BaseCloseButton from '../base-close-button.vue';

describe('testing Close Button component', () => {
  let component: Wrapper<Vue>;
  let localVue: typeof Vue;

  beforeEach(() => {
    [, localVue] = installNewXPlugin();
    component = mount(BaseCloseButton, {
      localVue
    });
  });

  it('emits UserClosedX by default when clicked', () => {
    const listener = jest.fn();

    component.vm.$x.on('UserClosedX').subscribe(listener);
    component.trigger('click');

    expect(listener).toHaveBeenCalled();
  });

  it('emits the defined closingEvent when clicked', async () => {
    const userClosedXListener = jest.fn();
    const userAcceptedAQueryListener = jest.fn();

    component.vm.$x.on('UserClosedX').subscribe(userClosedXListener);
    component.vm.$x.on('UserAcceptedAQuery').subscribe(userAcceptedAQueryListener);

    component.setProps({ closingEvent: 'UserAcceptedAQuery' });
    await localVue.nextTick();
    component.trigger('click');

    expect(userClosedXListener).not.toHaveBeenCalled();
    expect(userAcceptedAQueryListener).toHaveBeenCalled();
  });

  it('checks the default slot content is the expected', () => {
    expect(component.text()).toEqual('');
  });

  it('renders the content overriding default slot', () => {
    const overriddenSlotComponent = mount(BaseCloseButton, {
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
