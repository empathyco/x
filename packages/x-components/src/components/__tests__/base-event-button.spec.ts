import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { XPlugin } from '../../plugins';
import { WireMetadata } from '../../wiring/wiring.types';
import BaseEventButton from '../base-event-button.vue';

function render() {
  installNewXPlugin();

  const wrapper = mount(
    {
      template: `<BaseEventButton :events="events">
        <span class="test-msg">button text</span>
        <i class="test-icon"></i>
      </BaseEventButton>`,
      components: { BaseEventButton },
      props: ['events']
    },
    {
      propsData: { events: {} }
    }
  );

  return {
    wrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    expectedMetadata: {
      location: 'none',
      moduleName: null,
      replaceable: true,
      target: wrapper.element
    } as WireMetadata
  } as const;
}

describe('testing Base Event Button Component', () => {
  it('renders everything passed to its default slot', () => {
    const { wrapper } = render();

    expect(wrapper.find('.test-msg').exists()).toBeTruthy();
    expect(wrapper.find('.test-icon').exists()).toBeTruthy();
  });

  it('emits an event with a payload', async () => {
    const { wrapper, emitSpy, expectedMetadata } = render();

    await wrapper.setProps({ events: { testEvent: 'test-payload' } });
    await wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('testEvent', 'test-payload', expectedMetadata);
  });

  it('emits an event with no payload', async () => {
    const { wrapper, emitSpy, expectedMetadata } = render();

    await wrapper.setProps({ events: { testEvent: undefined } });
    await wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('testEvent', undefined, expectedMetadata);
  });

  it('emits multiple events with multiple payloads', async () => {
    const { wrapper, emitSpy, expectedMetadata } = render();

    const events = {
      testEvent1: 'test-payload-1',
      testEvent2: 'test-payload-2',
      testEvent3: undefined
    };
    await wrapper.setProps({ events });
    await wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(3);
    Object.entries(events).forEach(([event, payload]) =>
      expect(emitSpy).toHaveBeenCalledWith(event, payload, expectedMetadata)
    );
  });
});
