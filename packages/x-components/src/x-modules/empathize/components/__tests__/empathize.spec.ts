import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Empathize from '../empathize.vue';
import { empathizeXModule } from '../../x-module';
import { XPlugin } from '../../../../plugins/index';
import { XEvent } from '../../../../wiring/index';

jest.useFakeTimers();

describe('testing empathize component', () => {
  function renderEmpathize({
    eventsToOpenEmpathize = ['UserClickedSearchBox'],
    eventsToCloseEmpathize = ['UserClosedEmpathize'],
    template = `<Empathize v-bind="$attrs">
                  <template #default>
                    <span data-test="empathize-content">Empathize</span>
                  </template>
                </Empathize>`
  }: RenderEmpathizeOptions = {}): RenderEmpathizeAPI {
    const [, localVue] = installNewXPlugin();
    XPlugin.registerXModule(empathizeXModule);

    const parent = document.createElement('div');
    document.body.appendChild(parent);

    const wrapper = mount(
      {
        components: { Empathize },
        template
      },
      {
        localVue,
        attachTo: parent,
        propsData: {
          eventsToOpenEmpathize,
          eventsToCloseEmpathize
        }
      }
    ).findComponent(Empathize);

    return {
      wrapper
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderEmpathize();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('empathize');
  });

  it('will not open empathize if there is no content to render', async () => {
    const template = `<Empathize v-bind="$attrs"/>`;
    const { wrapper } = renderEmpathize({ template });

    wrapper.vm.$x.emit('UserClickedSearchBox');
    // Fast-forward until all timers have been executed
    jest.runAllTimers();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.x-empathize').exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(false);
  });

  it('listens to UserOpenedEmpathize and UserClosedEmpathize by default', async () => {
    const { wrapper } = renderEmpathize();

    wrapper.vm.$x.emit('UserClickedSearchBox');
    jest.runAllTimers();
    await wrapper.vm.$nextTick();

    // Both should exist and be visible
    expect(wrapper.find(getDataTestSelector('empathize')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('empathize')).element).toBeVisible();
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('empathize-content')).element).toBeVisible();

    wrapper.vm.$x.emit('UserClosedEmpathize');
    jest.runAllTimers();
    await wrapper.vm.$nextTick();

    // Both should exist, as v-show doesn't remove the elements in the DOM, and not be visible
    expect(wrapper.find(getDataTestSelector('empathize')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('empathize')).element).not.toBeVisible();
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(true);
    expect(wrapper.find(getDataTestSelector('empathize-content')).element).not.toBeVisible();
  });
});

interface RenderEmpathizeOptions {
  /**
   * Array of {@link XEvent | xEvents} to open the empathize.
   */
  eventsToOpenEmpathize?: XEvent[];
  /**
   * Array of {@link XEvent | xEvents} to close the empathize.
   */
  eventsToCloseEmpathize?: XEvent[];
  /**
   * The template to render {@link Empathize} component.
   */
  template?: string;
}

interface RenderEmpathizeAPI {
  /** The Vue testing utils wrapper for the {@link Empathize} component. */
  wrapper: Wrapper<Vue>;
}
