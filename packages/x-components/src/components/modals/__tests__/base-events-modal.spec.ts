import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseEventsModal from '../base-events-modal.vue';
import { PropsWithType } from '../../../utils/types';
import { XEventsTypes, XEvent } from '../../../wiring/events.types';
import { XPlugin } from '../../../plugins/index';
import { nextTick } from 'vue';
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
  eventsToOpenModal,
  contentClass
}: MountBaseEventsModalOptions = {}): MountBaseEventsModalAPI {
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const wrapper = mount(BaseEventsModal, {
    attachTo: parent,
    props: { bodyClickEvent, eventsToCloseModal, eventsToOpenModal, contentClass },
    slots: {
      default: defaultSlot
    },
    global: { plugins: [installNewXPlugin()] }
  });

  return {
    wrapper,
    async clickModalOverlay() {
      await wrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click');
    },
    async emit(event) {
      XPlugin.bus.emit(event);
      await nextTick();
    },
    getModalContent() {
      return wrapper.find(getDataTestSelector('modal-content'));
    },
    async fakeFocusIn() {
      jest.runAllTimers();
      document.body.dispatchEvent(new FocusEvent('focusin'));
      await nextTick();
    }
  };
}

describe('testing Base Events Modal  component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('opens and closes when UserClickedOpenX and UserClickedClosedX are emitted', async () => {
    const { emit, getModalContent } = mountBaseEventsModal();
    expect(getModalContent().exists()).toBe(false);

    await emit('UserClickedOpenEventsModal');
    expect(getModalContent().exists()).toBe(true);

    await emit('UserClickedCloseEventsModal');
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when clicking on the modal overlay', async () => {
    const { clickModalOverlay, emit, getModalContent } = mountBaseEventsModal();

    await emit('UserClickedOpenEventsModal');
    expect(getModalContent().exists()).toBe(true);

    await clickModalOverlay();
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emit, fakeFocusIn, getModalContent } = mountBaseEventsModal();

    await emit('UserClickedOpenEventsModal');
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

    await emit('UserClickedOpenEventsModal');
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
    XPlugin.bus.on(eventToOpen).subscribe(openListener);
    const closeListener = jest.fn();
    XPlugin.bus.on(eventToClose).subscribe(closeListener);

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
    XPlugin.bus.on(bodyClickEvent).subscribe(listener);

    await emit('UserClickedOpenEventsModal');
    expect(getModalContent().exists()).toBe(true);

    await clickModalOverlay();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getModalContent().exists()).toBe(false);
  });

  it('allows adding classes to the modal content', async () => {
    const { getModalContent, emit } = mountBaseEventsModal({
      contentClass: 'test-class'
    });

    await emit('UserClickedOpenEventsModal');
    expect(getModalContent().classes()).toContain('test-class');
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
  /** Class to add to the content element of the modal. */
  contentClass?: string;
}

interface MountBaseEventsModalAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper;
  /** Fakes a click on the modal overlay. */
  clickModalOverlay: () => Promise<void>;
  /** Emits the provided event. */
  emit: (event: PropsWithType<XEventsTypes, void>) => Promise<void>;
  /** Fakes a focusin event in another HTMLElement of the body. */
  fakeFocusIn: () => Promise<void>;
  /** Retrieves the modal content. */
  getModalContent: () => DOMWrapper<Element>;
}
