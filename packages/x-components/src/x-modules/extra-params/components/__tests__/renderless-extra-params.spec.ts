import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import RenderlessExtraParam from '../renderless-extra-param.vue';
import { resetXExtraParamStateWith } from './utils';

describe('testing RenderlessExtraParam component', () => {
  function renderRenderlessExtraParams({
    template = `<RenderlessExtraParam :name="name" :defaultValue="defaultValue" />`,
    defaultValue,
    name = 'warehouse',
    params
  }: RenderlessExtraParamsOptions): RenderlessExtraParamsAPI {
    const [, localVue] = installNewXPlugin({ initialXModules: [extraParamsXModule] });
    const store = XPlugin.store;
    resetXExtraParamStateWith(store, {
      params: params ?? {}
    });

    const wrapper = mount(
      {
        template,
        components: {
          RenderlessExtraParam
        },
        props: ['defaultValue', 'name']
      },
      {
        propsData: {
          defaultValue,
          name
        },
        localVue,
        store
      }
    );

    return {
      wrapper: wrapper.findComponent(RenderlessExtraParam)
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderRenderlessExtraParams({});
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  // eslint-disable-next-line max-len
  it("emits ExtraParamsProvided event when the component receives a default value and and it doesn't exist in the store", () => {
    const extraParamsProvidedCallback = jest.fn();
    const { wrapper } = renderRenderlessExtraParams({
      defaultValue: 1234
    });

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 1234 },
      metadata: { moduleName: 'extraParams' }
    });

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line max-len
  it("not emits ExtraParamsProvided event when the component receives a default value if it's in the store", () => {
    const extraParamsProvidedCallback = jest.fn();
    const { wrapper } = renderRenderlessExtraParams({
      defaultValue: 1234,
      params: { warehouse: 1234 }
    });

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(0);
  });

  it('emits UserChangedExtraParams event when the update method is called', () => {
    const userChangedExtraParamsCallback = jest.fn();
    const { wrapper } = renderRenderlessExtraParams({
      template: `
        <RenderlessExtraParam name="warehouse" #default="{ defaultValue, updateValue }">
          <button data-test="custom-slot" @click="updateValue(45678)">Update warehouse</button>
        </RenderlessExtraParam>`
    });

    wrapper.vm.$x.on('UserChangedExtraParams', true).subscribe(userChangedExtraParamsCallback);

    expect(userChangedExtraParamsCallback).toHaveBeenCalledTimes(0);

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
  /** The extra param's default value. */
  defaultValue?: unknown;
  /** The extra param's name. */
  name?: unknown;
  /** A dictionary with the params to save in the store. */
  params?: Dictionary<unknown>;
  /** The template to render. */
  template?: string;
}

interface RenderlessExtraParamsAPI {
  /** The wrapper for the extra params component. */
  wrapper: Wrapper<Vue>;
}
