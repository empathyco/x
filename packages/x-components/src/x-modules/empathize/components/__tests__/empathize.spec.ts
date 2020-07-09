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
        <div>
          <BaseEventButton
            :events="{ UserOpenedEmpathize: undefined }"
            data-test="empathize-opener"
          />
          <Empathize>
            <template #default>
              <span data-test="empathize-content">Empathize</span>
            </template>
          </Empathize>
          <BaseEventButton
            :events="{ UserClosedEmpathize: undefined }"
            data-test="empathize-closer"
          />
        </div>
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

    componentWrapper.find(getDataTestSelector('empathize-opener')).trigger('click');
    await localVue.nextTick();
    expect(componentWrapper.find(getDataTestSelector('empathize')).element).toBeDefined();

    componentWrapper.find(getDataTestSelector('empathize-closer')).trigger('click');
    await localVue.nextTick();
    expect(componentWrapper.find(getDataTestSelector('empathize')).element).not.toBeDefined();
  });
});
