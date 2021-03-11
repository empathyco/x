import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseEventsModal from '../base-events-modal.vue';
import { PropsWithType } from '../../../utils/types';
import { XEventsTypes, XEvent } from '../../../wiring/events.types';

/**
 * Renders the {@link BaseEventsModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseEventsModal({
  template = '<BaseEventsModal v-bind="$attrs" />',
  bodyClickEvent,
  eventsToCloseModal,
  eventsToOpenModal
}: RenderBaseEventsModalOptions = {}): RenderBaseEventsModalAPI {
  const [, localVue] = installNewXPlugin();
  const div = document.createElement('div');
  document.body.appendChild(div);
  const wrapper = mount(
    {
      components: {
        BaseEventsModal
      },
      template
    },
    {
      propsData: { bodyClickEvent, eventsToCloseModal, eventsToOpenModal },
      localVue,
      attachTo: div
    }
  );

  const modalWrapper = wrapper.findComponent(BaseEventsModal);

  return {
    wrapper: modalWrapper,
    emitClose() {
      wrapper.vm.$x.emit('UserClickedCloseX');
      return localVue.nextTick();
    },
    emitOpen() {
      wrapper.vm.$x.emit('UserClickedOpenX');
      return localVue.nextTick();
    },
    clickBody() {
      document.body.click();
      return localVue.nextTick();
    },
    focusBody() {
      document.body.dispatchEvent(new FocusEvent('focusin'));
      return localVue.nextTick();
    },
    clickOverlay() {
      modalWrapper.trigger('click');
      return localVue.nextTick();
    },
    getModalElement() {
      return modalWrapper.find(getDataTestSelector('modal'));
    },
    emit(event) {
      wrapper.vm.$x.emit(event);
      return localVue.nextTick();
    }
  };
}

describe('testing Base Events Modal  component', () => {
  it('opens and closes when clicking on the open & close buttons', async () => {
    const { emitOpen, emitClose, getModalElement } = renderBaseEventsModal();
    expect(getModalElement().exists()).toBe(false);

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await emitClose();
    expect(getModalElement().exists()).toBe(false);
  });

  it('closes when clicking on any element of the body', async () => {
    const { emitOpen, clickBody, getModalElement } = renderBaseEventsModal();

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await clickBody();
    expect(getModalElement().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emitOpen, focusBody, getModalElement } = renderBaseEventsModal();

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await focusBody();
    expect(getModalElement().exists()).toBe(false);
  });

  it('closes when clicking on the overlay element', async () => {
    const { emitOpen, clickOverlay, getModalElement } = renderBaseEventsModal();

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await clickOverlay();
    expect(getModalElement().exists()).toBe(false);
  });

  it('does not close when clicking inside the content', async () => {
    const { wrapper, emitOpen, getModalElement } = renderBaseEventsModal({
      template: `
        <BaseEventsModal v-bind="$attrs">
          <button data-test="test-button">Modal should still be open when I'm clicked</button>
        </BaseEventsModal>`
    });

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    const button = wrapper.find(getDataTestSelector('test-button'));
    await button.trigger('click');
    expect(getModalElement().exists()).toBe(true);
  });

  it('allows to customize the events listened for opening & closing', async () => {
    const { getModalElement, emit } = renderBaseEventsModal({
      eventsToOpenModal: ['UserFocusedSearchBox'],
      eventsToCloseModal: ['UserPressedClearSearchBoxButton']
    });

    await emit('UserFocusedSearchBox');
    expect(getModalElement().exists()).toBe(true);

    await emit('UserPressedClearSearchBoxButton');
    expect(getModalElement().exists()).toBe(false);
  });

  it('allows to customize the event emitted when clicking out of the modal', async () => {
    const { getModalElement, emitOpen, clickBody, wrapper } = renderBaseEventsModal({
      bodyClickEvent: 'UserClickedASimpleFilter'
    });
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedASimpleFilter').subscribe(listener);

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);

    await clickBody();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getModalElement().exists()).toBe(true);
  });
});

interface RenderBaseEventsModalOptions {
  /** The template to render. */
  template?: string;
  /** Events that when emitted should open the modal. */
  eventsToOpenModal?: XEvent[];
  /** Events that when emitted should close the modal. */
  eventsToCloseModal?: XEvent[];
  /** The event that should be emitted when the body is clicked. */
  bodyClickEvent?: XEvent;
}

interface RenderBaseEventsModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Fakes a click on the close button. */
  emitClose: () => Promise<void>;
  /** Fakes a click on the open button. */
  emitOpen: () => Promise<void>;
  /** Fakes a click on the body. */
  clickBody: () => Promise<void>;
  /** Fakes a focusin event in the body. */
  focusBody: () => Promise<void>;
  /** Fakes a click on the . */
  clickOverlay: () => Promise<void>;
  /** Retrieves the modal  wrapper. */
  getModalElement: () => Wrapper<Vue>;
  /** Emits the provided event. */
  emit: (event: PropsWithType<XEventsTypes, void>) => Promise<void>;
}
