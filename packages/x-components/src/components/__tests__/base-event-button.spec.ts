import { ComponentMountingOptions, mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { XPlugin } from '../../plugins';
import { WireMetadata } from '../../wiring/wiring.types';
import BaseEventButton from '../base-event-button.vue';
import { XEventsTypes } from 'src/wiring';

const stubSlot = `<span class="test-msg">button text</span>
        <i class="test-icon"></i>`;

function render(options: ComponentMountingOptions<typeof BaseEventButton> = {}) {
  const wrapper = mount(BaseEventButton, {
    props: { events: {} },
    slots: { default: stubSlot },
    global: { plugins: [installNewXPlugin()] },
    ...options
  });

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

    await wrapper.setProps({ events: { testEvent: 'test-payload' } as Partial<XEventsTypes> });
    await wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('testEvent', 'test-payload', expectedMetadata);
  });

  it('emits an event with no payload', async () => {
    const { wrapper, emitSpy, expectedMetadata } = render();

    await wrapper.setProps({ events: { testEvent: undefined } as Partial<XEventsTypes> });
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
    } as Partial<XEventsTypes>;
    await wrapper.setProps({ events });
    await wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(3);
    Object.entries(events).forEach(([event, payload]) =>
      expect(emitSpy).toHaveBeenCalledWith(event, payload, expectedMetadata)
    );
  });
});
