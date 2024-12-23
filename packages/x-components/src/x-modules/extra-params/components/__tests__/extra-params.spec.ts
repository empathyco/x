import { Dictionary } from '@empathyco/x-utils';
import { mount, VueWrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import ExtraParams from '../extra-params.vue';

describe('testing extra params component', () => {
  function renderExtraParams(values: Dictionary<unknown>): RenderExtraParamsApi {
    XPlugin.resetInstance();
    XPlugin.registerXModule(extraParamsXModule);

    const wrapper = mount(ExtraParams, {
      props: {
        values
      },
      global: {
        plugins: [installNewXPlugin()]
      }
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

    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 1234 },
      metadata: { moduleName: 'extraParams', location: 'none', replaceable: true }
    });
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ values: { warehouse: 5678 } });

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 5678 },
      metadata: { moduleName: 'extraParams', location: 'none', replaceable: true }
    });
    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(2);
  });
});

interface RenderExtraParamsApi {
  /** The wrapper for the extra params component. */
  wrapper: VueWrapper;
}
