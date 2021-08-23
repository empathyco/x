import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { AnyFunction, Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import RenderlessExtraParam from '../renderless-extra-param.vue';

describe('testing Renderless extra params component', () => {
  function renderRenderlessExtraParams({
    scopedSlots,
    defaultValue,
    extraParamName
  }: RenderlessExtraParamsOptions): RenderlessExtraParamsAPI {
    XPlugin.resetInstance();
    const [, localVue] = installNewXPlugin();
    XPlugin.registerXModule(extraParamsXModule);

    const wrapper = mount(RenderlessExtraParam, {
      propsData: {
        extraParamName,
        defaultValue
      },
      localVue,
      scopedSlots
    });

    return {
      wrapper
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderRenderlessExtraParams({ extraParamName: 'warehouse' });
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  it('renders a custom slot content', () => {
    const { wrapper } = renderRenderlessExtraParams({
      extraParamName: 'warehouse',
      scopedSlots: { default: `<span data-test="custom-slot">Custom slot</span>` }
    });

    expect(wrapper.find(getDataTestSelector('custom-slot')).text()).toEqual('Custom slot');
  });

  it('emits UserChangedExtraParams event when the update method is called', () => {
    const userChangedExtraParamsCallback = jest.fn();
    const { wrapper } = renderRenderlessExtraParams({
      extraParamName: 'warehouse',
      scopedSlots: {
        default: `
          <template #search="{ defaultValue, updateValue }">
            <button data-test="custom-slot" @click="updateValue(45678)">Update warehouse</button>
          </template>`
      }
    });

    wrapper.vm.$x.on('UserChangedExtraParams', true).subscribe(userChangedExtraParamsCallback);

    wrapper.find(getDataTestSelector('custom-slot')).element.click();

    expect(userChangedExtraParamsCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>(
      {
        eventPayload: { warehouse: 45678 },
        metadata: { moduleName: 'extraParams' }
      }
    );

    expect(userChangedExtraParamsCallback).toHaveBeenCalledTimes(1);
  });
});

interface RenderlessExtraParamsOptions {
  /** The scoped slots to render. */
  scopedSlots?: Record<string, string | AnyFunction>;
  /** The name of the extra param name to be changed. */
  extraParamName: string;
  /** The default value of the extra param. */
  defaultValue?: string | number;
}

interface RenderlessExtraParamsAPI {
  /** The wrapper for the extra params component. */
  wrapper: Wrapper<Vue>;
}
