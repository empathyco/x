import { DeepPartial, Dictionary } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import SnippetConfigExtraParams from '../snippet-config-extra-params.vue';
import { RootXStoreState } from '../../../../store/index';
import { SnippetConfig } from '../../../../x-installer/index';

function renderSnippetConfigExtraParams({
  values = {},
  excludedExtraParams = ['callbacks', 'productId', 'uiLang']
}: RenderSnippetConfigExtraParamsOptions = {}): RenderSnippetConfigExtraParamsApi {
  const snippetConfig = Vue.observable({ warehouse: 1234, callbacks: {} });
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);
  XPlugin.registerXModule(extraParamsXModule);

  const extraParamsProvidedCallback: jest.Mock = jest.fn();
  XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

  const wrapper = mount(SnippetConfigExtraParams, {
    localVue,
    store,
    provide: {
      snippetConfig
    },
    propsData: {
      values,
      excludedExtraParams
    }
  });

  async function setSnippetConfig(newValue: Dictionary<unknown>): Promise<void> {
    Object.assign(snippetConfig, newValue);
    await Vue.nextTick();
  }

  return {
    wrapper: wrapper.findComponent(SnippetConfigExtraParams),
    setSnippetConfig,
    extraParamsProvidedCallback
  };
}

describe('testing snippet config extra params component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderSnippetConfigExtraParams();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  // eslint-disable-next-line max-len
  it('emits the ExtraParamsProvided event when the component is loaded, when the values prop changes, and when the snippet config changes', async () => {
    const { wrapper, setSnippetConfig, extraParamsProvidedCallback } =
      renderSnippetConfigExtraParams();

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234 }
      })
    );

    await wrapper.setProps({ values: { store: 'myStore' } });

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      2,
      expect.objectContaining({
        eventPayload: { warehouse: 1234, store: 'myStore' }
      })
    );

    await setSnippetConfig({ warehouse: 45679 });

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      3,
      expect.objectContaining({
        eventPayload: { warehouse: 45679, store: 'myStore' }
      })
    );
  });

  // eslint-disable-next-line max-len
  it('emits the ExtraParamsProvided event with the values from the snippet config and the extra params', () => {
    const { extraParamsProvidedCallback } = renderSnippetConfigExtraParams({
      values: { scope: 'mobile' }
    });

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234, scope: 'mobile' }
      })
    );
  });

  // eslint-disable-next-line max-len
  it('does not emit ExtraParamsProvided when any no extra params in the snippet config changes', async () => {
    const { setSnippetConfig, extraParamsProvidedCallback } = renderSnippetConfigExtraParams();

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234 }
      })
    );

    await setSnippetConfig({ uiLang: 'es' });

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1);

    await setSnippetConfig({ warehouse: 45678 });

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      2,
      expect.objectContaining({
        eventPayload: { warehouse: 45678 }
      })
    );
  });

  it('not includes the callback configuration as extra params', () => {
    const { extraParamsProvidedCallback } = renderSnippetConfigExtraParams();

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.not.objectContaining({
        eventPayload: { callbacks: {} }
      })
    );
  });

  it('allows to configure excluded params', () => {
    const { extraParamsProvidedCallback } = renderSnippetConfigExtraParams({
      values: {
        xEngineId: 'motive',
        currency: 'EUR'
      },
      excludedExtraParams: ['currency', 'warehouse', 'callbacks']
    });

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: {
          xEngineId: 'motive'
        }
      })
    );
  });
});

interface RenderSnippetConfigExtraParamsOptions {
  /**
   * Extra values to use as extra params, apart from the ones extracted from the
   * {@link SnippetConfig}.
   */
  values?: Dictionary<unknown>;
  /**
   * Keys of the {@link SnippetConfig} to exclude from being sent as extra params.
   */
  excludedExtraParams?: Array<keyof SnippetConfig>;
}

interface RenderSnippetConfigExtraParamsApi {
  /** The wrapper for the snippet config component. */
  wrapper: Wrapper<Vue>;
  /** Helper method to change the snippet config. */
  setSnippetConfig: (
    newSnippetConfig: Dictionary<unknown>
  ) => void | Promise<void> /** Jest mock function for the ExtraParamsProvided callback. */;
  /** Jest mock function for the ExtraParamsProvided callback. */
  extraParamsProvidedCallback: jest.Mock;
}
