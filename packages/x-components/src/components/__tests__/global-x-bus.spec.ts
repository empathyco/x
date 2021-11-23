import { mount, Wrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { XComponentBusAPI } from '../../plugins/x-plugin.types';
import GlobalXBus from '../global-x-bus.vue';

function renderGlobalXBus({
  template = '<GlobalXBus />',
  listeners = {}
}: RenderGlobalXBusOptions = {}): RenderGlobalXBusAPI {
  const [, localVue] = installNewXPlugin();
  const wrapperTemplate = mount(
    {
      components: {
        GlobalXBus
      },
      template
    },
    { listeners, localVue }
  );
  const wrapper = wrapperTemplate.findComponent(GlobalXBus);

  return {
    wrapper,
    on: wrapperTemplate.vm.$x.on.bind(wrapperTemplate.vm.$x),
    emit: wrapperTemplate.vm.$x.emit.bind(wrapperTemplate.vm.$x)
  };
}

describe('testing GlobalXBus component', function () {
  // eslint-disable-next-line max-len
  it('should execute a callback provided with the listeners when the event is emitted', function () {
    const eventSpy = jest.fn();
    const { emit } = renderGlobalXBus({
      listeners: { UserAcceptedAQuery: eventSpy }
    });

    emit('UserAcceptedAQuery', 'lego');
    expect(eventSpy).toHaveBeenCalled();
  });
  it('emits a SnippetCallbackExecuted event when a callback is executed', function () {
    const dummyFunction = jest.fn();
    const { on, emit } = renderGlobalXBus({
      listeners: { UserAcceptedAQuery: dummyFunction }
    });

    const eventSpy = jest.fn();
    on('SnippetCallbackExecuted').subscribe(eventSpy);

    emit('UserAcceptedAQuery', 'lego');
    expect(eventSpy).toHaveBeenCalled();
  });
});

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderGlobalXBusOptions {
  /** The template to render.*/
  template?: string;
  /** The listeners object in the component.*/
  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners?: Record<string, Function | Function[]>;
}

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderGlobalXBusAPI {
  /** The wrapper for the progress bar component. */
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentBusAPI.on} method to subscribe events. */
  on: XComponentBusAPI['on'];
  /** The {@link XComponentBusAPI.emit} method to emit events. */
  emit: XComponentBusAPI['emit'];
}
