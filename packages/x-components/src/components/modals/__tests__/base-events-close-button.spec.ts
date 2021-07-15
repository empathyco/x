import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../__tests__/utils';
import { XEvent } from '../../../wiring/events.types';
import BaseEventsModalClose from '../base-events-modal-close.vue';

/**
 * Renders the {@link BaseEventsModalClose} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalClose({
  template = '<BaseEventsModalClose v-bind="$attrs"/>',
  closingEvent
}: RenderBaseEventsModalCloseOptions = {}): RenderBaseEventsModalCloseAPI {
  const [, localVue] = installNewXPlugin();
  const containerWrapper = mount(
    {
      components: {
        BaseEventsModalClose
      },
      template
    },
    { propsData: { closingEvent }, localVue }
  );

  const wrapper = containerWrapper.findComponent(BaseEventsModalClose);

  return {
    wrapper,
    async click() {
      wrapper.trigger('click');
      await localVue.nextTick();
    }
  };
}

describe('testing Close Button component', () => {
  it('emits UserClickedCloseX by default when clicked', async () => {
    const { wrapper, click } = renderBaseEventsModalClose();
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedCloseX').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('emits the defined closingEvent when clicked', async () => {
    const { wrapper, click } = renderBaseEventsModalClose({
      closingEvent: 'UserClickedAFilter'
    });
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedAFilter').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderBaseEventsModalClose({
      template: '<BaseEventsModalClose v-bind="$attrs">Close</BaseEventsModalClose>'
    });

    expect(wrapper.text()).toEqual('Close');
  });
});

interface RenderBaseEventsModalCloseOptions {
  /** The template to render. */
  template?: string;
  /** Event that should be emitted when the button is clicked. */
  closingEvent?: XEvent;
}

interface RenderBaseEventsModalCloseAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Clicks the button. */
  click: () => Promise<void>;
}
