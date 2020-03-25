import { mount } from '@vue/test-utils';
import { forEach } from '../../../utils/object';
import { WireMetadata } from '../../../wiring/wiring.types';
import EventButton from '../event-button.vue';

describe('testing Event Button Component', () => {
  const emitSpy = jest.fn();

  const componentWrapper = mount(EventButton, {
    propsData: {
      events: {}
    },
    mocks: {
      $x: {
        emit: emitSpy
      }
    },
    slots: {
      default: [
        { template: '<span class="test-msg">button text</span>' },
        { template: '<i class="test-icon"></i>' }
      ]
    }
  });
  const expectedMetadata: Omit<WireMetadata, 'moduleName'> = {
    target: componentWrapper.element
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders everything passed to its default slot', () => {
    expect(componentWrapper.contains('.test-msg')).toBeTruthy();
    expect(componentWrapper.contains('.test-icon')).toBeTruthy();
  });

  it('emits an event with a payload', () => {
    componentWrapper.setProps({
      events: { testEvent: 'testPayload' }
    });
    componentWrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledWith('testEvent', 'testPayload', expectedMetadata);
  });

  it('emits an event with no payload', () => {
    componentWrapper.setProps({ events: { testEvent: undefined } });
    componentWrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledWith('testEvent', undefined, expectedMetadata);
  });

  it('emits multiple events with multiple payloads', () => {
    const events = {
      testEvent1: 'test-payload-1',
      testEvent2: 'test-payload-2',
      testEvent3: undefined
    };
    componentWrapper.setProps({ events });
    componentWrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(3);
    forEach(events, (event, payload) =>
      expect(emitSpy).toHaveBeenCalledWith(event, payload, expectedMetadata)
    );
  });
});
