import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import ExtraParams from '../extra-params.vue';

describe('testing extra params component', () => {
  function renderExtraParams(values: Dictionary<unknown>): RenderExtraParamsApi {
    XPlugin.resetInstance();
    const [, localVue] = installNewXPlugin();
    XPlugin.registerXModule(extraParamsXModule);

    const wrapper = mount(ExtraParams, {
      propsData: {
        values
      },
      localVue
    });

    return {
      wrapper
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderExtraParams({ warehouse: 1234 });
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  it('emits the ExtraParamsProvided event when the values change', async () => {
    const { wrapper } = renderExtraParams({ warehouse: 1234 });
    const extraParamsProvidedCallback = jest.fn();

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 1234 },
      metadata: { moduleName: 'extraParams' }
    });
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ values: { warehouse: 5678 } });

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 5678 },
      metadata: { moduleName: 'extraParams' }
    });
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(2);
  });
});

interface RenderExtraParamsApi {
  /** The wrapper for the extra params component. */
  wrapper: Wrapper<Vue>;
}
