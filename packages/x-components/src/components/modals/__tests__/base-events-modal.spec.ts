import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseEventsModal from '../base-events-modal.vue';
import { PropsWithType } from '../../../utils/types';
import { XEventsTypes, XEvent } from '../../../wiring/events.types';

/**
 * Mounts a {@link BaseEventsModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseEventsModal({
  defaultSlot = '<span data-test="default-slot">Modal</span>',
  bodyClickEvent,
  eventsToCloseModal,
  eventsToOpenModal
}: MountBaseEventsModalOptions = {}): MountBaseEventsModalAPI {
  const [, localVue] = installNewXPlugin();
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const wrapper = mount(BaseEventsModal, {
    attachTo: parent,
    localVue,
    propsData: { bodyClickEvent, eventsToCloseModal, eventsToOpenModal },
    slots: {
      default: defaultSlot
    }
  });

  return {
    wrapper,
    async clickModalOverlay() {
      await wrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click');
    },
    async emit(event) {
      wrapper.vm.$x.emit(event);
      await localVue.nextTick();
    },
    getModalContent() {
      return wrapper.find(getDataTestSelector('modal-content'));
    },
    async fakeFocusIn() {
      const buttonWrapper = mount({
        template: `<button>Button</button>`
      });
      document.body.appendChild(wrapper.element);
      document.body.appendChild(buttonWrapper.element);

      await buttonWrapper.trigger('focusin');

      document.body.removeChild(wrapper.element);
      document.body.removeChild(buttonWrapper.element);
    }
  };
}

describe('testing Base Events Modal  component', () => {
  it('opens and closes when UserClickedOpenX and UserClickedClosedX are emitted', async () => {
    const { emit, getModalContent } = mountBaseEventsModal();
    expect(getModalContent().exists()).toBe(false);

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await emit('UserClickedCloseX');
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when clicking on the modal overlay', async () => {
    const { clickModalOverlay, emit, getModalContent } = mountBaseEventsModal();

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await clickModalOverlay();
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emit, fakeFocusIn, getModalContent } = mountBaseEventsModal();

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await fakeFocusIn();
    expect(getModalContent().exists()).toBe(false);
  });

  it('does not close when clicking inside the content', async () => {
    const { wrapper, emit, getModalContent } = mountBaseEventsModal({
      defaultSlot: `
        <button data-test="test-button">Modal should still be opened when I'm clicked</button>
      `
    });

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await wrapper.find(getDataTestSelector('test-button')).trigger('click');
    expect(getModalContent().exists()).toBe(true);
  });

  it('allows to customize the events listened for opening & closing', async () => {
    const eventToOpen = 'UserFocusedSearchBox';
    const eventToClose = 'UserPressedClearSearchBoxButton';
    const { emit, getModalContent, wrapper } = mountBaseEventsModal({
      eventsToOpenModal: [eventToOpen],
      eventsToCloseModal: [eventToClose]
    });

    const openListener = jest.fn();
    wrapper.vm.$x.on(eventToOpen).subscribe(openListener);
    const closeListener = jest.fn();
    wrapper.vm.$x.on(eventToClose).subscribe(closeListener);

    await emit(eventToOpen);
    expect(getModalContent().exists()).toBe(true);
    expect(openListener).toHaveBeenCalled();

    await emit(eventToClose);
    expect(getModalContent().exists()).toBe(false);
    expect(closeListener).toHaveBeenCalled();
  });

  it('allows to customize the event emitted when clicking out of the modal', async () => {
    const bodyClickEvent = 'UserClickedASimpleFilter';
    const { wrapper, clickModalOverlay, emit, getModalContent } = mountBaseEventsModal({
      bodyClickEvent,
      eventsToCloseModal: [bodyClickEvent]
    });
    const listener = jest.fn();
    wrapper.vm.$x.on(bodyClickEvent).subscribe(listener);

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await clickModalOverlay();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getModalContent().exists()).toBe(false);
  });
});

interface MountBaseEventsModalOptions {
  /** The default slot to render. */
  defaultSlot?: string;
  /** The event that should be emitted when the body is clicked. */
  bodyClickEvent?: XEvent;
  /** Events that when emitted should close the modal. */
  eventsToCloseModal?: XEvent[];
  /** Events that when emitted should open the modal. */
  eventsToOpenModal?: XEvent[];
}

interface MountBaseEventsModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Fakes a click on the modal overlay. */
  clickModalOverlay: () => Promise<void>;
  /** Emits the provided event. */
  emit: (event: PropsWithType<XEventsTypes, void>) => Promise<void>;
  /** Fakes a focusin event in another HTMLElement of the body. */
  fakeFocusIn: () => Promise<void>;
  /** Retrieves the modal content. */
  getModalContent: () => Wrapper<Vue>;
}
