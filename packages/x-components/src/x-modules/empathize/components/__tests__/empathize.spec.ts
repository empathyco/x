import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import BaseEventButton from '../../../../components/base-event-button.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Empathize from '../empathize.vue';
import { empathizeXModule } from '../../x-module';
import { XPlugin } from '../../../../plugins/index';
import { XEvent } from '../../../../wiring/index';

describe('testing empathize component', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function renderEmpathize({
    eventsToOpenEmpathize,
    eventsToCloseEmpathize,
    template = `<Empathize
                  :events-to-open-empathize="['TestOpenEvent']"
                  :events-to-close-empathize="['TestCloseEvent']"
                >
                  <template #default>
                    <span data-test="empathize-content">Empathize</span>
                  </template>
                </Empathize>`,
    eventToSpy
  }: RenderEmpathizeOptions = {}): RenderEmpathizeAPI {
    const [, localVue] = installNewXPlugin();
    XPlugin.registerXModule(empathizeXModule);

    let eventSpy;
    if (eventToSpy) {
      eventSpy = jest.fn();
      XPlugin.bus.on(eventToSpy).subscribe(eventSpy);
    }

    const wrapper = mount(
      {
        props: ['eventsToOpenEmpathize', 'eventsToCloseEmpathize'],
        components: { Empathize, BaseEventButton },
        template
      },
      {
        localVue,
        propsData: {
          eventsToOpenEmpathize,
          eventsToCloseEmpathize
        }
      }
    ).findComponent(Empathize);

    return {
      wrapper,
      eventSpy
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderEmpathize();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('empathize');
  });

  it('listens to UserOpenedEmpathize and UserClosedEmpathize by default', async () => {
    const { wrapper } = renderEmpathize();

    wrapper.vm.$x.emit('TestOpenEvent' as any);
    await new Promise(resolve => setTimeout(resolve));
    // await localVue.nextTick();
    expect(wrapper.find('.x-empathize').exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(true);

    wrapper.vm.$x.emit('TestCloseEvent' as any);
    await new Promise(resolve => setTimeout(resolve));
    // await localVue.nextTick();
    expect(wrapper.find('.x-empathize').exists()).toBe(false);
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(false);
  });
});

interface RenderEmpathizeOptions {
  /**
   * Array of {@link XEvent | xEvents} to open the empathize.
   */
  eventsToOpenEmpathize: XEvent[];
  /**
   * Array of {@link XEvent | xEvents} to close the empathize.
   */
  eventsToCloseEmpathize: XEvent[];
  /**
   * The template to render {@link Empathize} component.
   */
  template?: string;
  /**
   * An event to spy on.
   */
  eventToSpy?: XEvent;
}

interface RenderEmpathizeAPI {
  /** The Vue testing utils wrapper for the {@link Empathize} component. */
  wrapper: Wrapper<Vue>;
  /** A Jest spy set in the {@link XPlugin} `on` function. */
  eventSpy?: jest.Mock;
}
