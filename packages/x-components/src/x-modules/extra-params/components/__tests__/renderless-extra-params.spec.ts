import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { RootXStoreState } from '../../../../store';
import { AnyFunction, DeepPartial, Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import RenderlessExtraParam from '../renderless-extra-param.vue';
import { resetXExtraParamStateWith } from './utils';

describe('testing Renderless extra params component', () => {
  function renderRenderlessExtraParams({
    scopedSlots,
    defaultValue,
    extraParamName,
    params
  }: RenderlessExtraParamsOptions): RenderlessExtraParamsAPI {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    const store: Store<DeepPartial<RootXStoreState>> = new Store({});
    installNewXPlugin({ store }, localVue);

    resetXExtraParamStateWith(store, {
      params: params ?? {}
    });

    const wrapper = mount(RenderlessExtraParam, {
      propsData: {
        extraParamName,
        defaultValue
      },
      localVue,
      store,
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

  // eslint-disable-next-line max-len
  it("emits ExtraParamsProvided event when the component receives a default value and it isn't in the store", () => {
    const extraParamsProvidedCallback = jest.fn();
    const { wrapper } = renderRenderlessExtraParams({
      extraParamName: 'warehouse',
      defaultValue: 1234
    });

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      {
        eventPayload: { warehouse: 1234 },
        metadata: { moduleName: 'extraParams' }
      }
    );
  });

  // eslint-disable-next-line max-len
  it('not emits ExtraParamsProvided event when the component receives a default value if its in the store', () => {
    const extraParamsProvidedCallback = jest.fn();

    const { wrapper } = renderRenderlessExtraParams({
      extraParamName: 'warehouse',
      defaultValue: 1234,
      params: { warehouse: 1234 }
    });

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(0);
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

    expect(userChangedExtraParamsCallback).toHaveBeenNthCalledWith<
      [WirePayload<Dictionary<unknown>>]
    >(1, {
      eventPayload: { warehouse: 45678 },
      metadata: { moduleName: 'extraParams' }
    });
  });
});

interface RenderlessExtraParamsOptions {
  /** The default value of the extra param. */
  defaultValue?: string | number;
  /** The name of the extra param to be changed. */
  extraParamName: string;
  /** The scoped slots to render. */
  scopedSlots?: Record<string, string | AnyFunction>;
  /** A dictionary with the params to save in the store. */
  params?: Dictionary<unknown>;
}

interface RenderlessExtraParamsAPI {
  /** The wrapper for the extra params component. */
  wrapper: Wrapper<Vue>;
}
