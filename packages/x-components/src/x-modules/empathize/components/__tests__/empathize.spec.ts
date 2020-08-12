import { mount } from '@vue/test-utils';
import Vue from 'vue';
import BaseEventButton from '../../../../components/base-event-button.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import Empathize from '../empathize.vue';

describe('testing empathize component', () => {
  let localVue: typeof Vue;

  beforeEach(() => {
    [, localVue] = installNewXPlugin({});
  });

  it('is an XComponent which has an XModule', () => {
    const empathize = mount(Empathize, { localVue });
    expect(isXComponent(empathize.vm)).toEqual(true);
    expect(getXComponentXModuleName(empathize.vm)).toEqual('empathize');
  });

  it('listens to UserOpenedEmpathize and UserClosedEmpathize by default', async () => {
    const component = {
      template: `
        <Empathize :events-to-open-empathize="['TestOpenEvent']"
                   :events-to-close-empathize="['TestCloseEvent']">
          <template #default>
            <span data-test="empathize-content">Empathize</span>
          </template>
        </Empathize>
      `,
      components: {
        BaseEventButton,
        Empathize
      },
      localVue
    };
    const componentWrapper = mount(component, {
      localVue
    });

    componentWrapper.vm.$x.emit('TestOpenEvent' as any);
    await new Promise(resolve => setTimeout(resolve));
    // await localVue.nextTick();
    expect(componentWrapper.find('.x-empathize').exists()).toBe(true);
    expect(componentWrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(true);

    componentWrapper.vm.$x.emit('TestCloseEvent' as any);
    await new Promise(resolve => setTimeout(resolve));
    // await localVue.nextTick();
    expect(componentWrapper.find('.x-empathize').exists()).toBe(false);
    expect(componentWrapper.find(getDataTestSelector('empathize-content')).exists()).toBe(false);
  });
});
