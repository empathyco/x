import { Dictionary } from '@empathyco/x-utils';
import { mount, VueWrapper } from '@vue/test-utils';
import { reactive, nextTick } from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { WirePayload } from '../../../../wiring';
import SnippetConfigExtraParams from '../snippet-config-extra-params.vue';
import { SnippetConfig } from '../../../../x-installer/api/api.types';
describe('testing snippet config extra params component', () => {
  function renderSnippetConfigExtraParams({
    values,
    excludedExtraParams
  }: RenderSnippetConfigExtraParamsOptions = {}): RenderSnippetConfigExtraParamsApi {
    const snippetConfig = reactive({ warehouse: 1234, callbacks: {} });
    const wrapper = mount(
      {
        template: `
            <SnippetConfigExtraParams :values="values" :excludedExtraParams="excludedExtraParams"/>
        `,
        components: {
          SnippetConfigExtraParams
        },
        props: ['values', 'excludedExtraParams'],
        provide() {
          return {
            snippetConfig
          };
        }
      },
      {
        global: {
          plugins: [installNewXPlugin()]
        },
        props: {
          values,
          excludedExtraParams
        }
      }
    );
    function setSnippetConfig(newValue: Dictionary<unknown>): Promise<void> {
      Object.assign(snippetConfig, newValue);
      return nextTick();
    }
    return {
      wrapper,
      setSnippetConfig
    };
  }
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderSnippetConfigExtraParams();
    const component = wrapper.findComponent(SnippetConfigExtraParams);
    expect(isXComponent(component.vm)).toEqual(true);
    expect(getXComponentXModuleName(component.vm)).toEqual('extraParams');
  });
  // eslint-disable-next-line max-len
  it('emits the ExtraParamsProvided event when the component is loaded, when the values prop changes, and when the snippet config changes', async () => {
    const { wrapper, setSnippetConfig } = renderSnippetConfigExtraParams();
    const extraParamsProvidedCallback = jest.fn();
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);
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
    renderSnippetConfigExtraParams({ values: { scope: 'mobile' } });
    const extraParamsProvidedCallback = jest.fn();
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);
    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234, scope: 'mobile' }
      })
    );
  });
  // eslint-disable-next-line max-len
  it('does not emit ExtraParamsProvided when any no extra params in the snippet config changes', async () => {
    const { setSnippetConfig } = renderSnippetConfigExtraParams();
    const extraParamsProvidedCallback = jest.fn();
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);
    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234 }
      })
    );
    await setSnippetConfig({ warehouse: 1234 });

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1);

    await setSnippetConfig({ uiLang: 'es' }); // Set an excluded extra param

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
    renderSnippetConfigExtraParams();
    const extraParamsProvidedCallback = jest.fn();
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);
    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.not.objectContaining({
        eventPayload: { callbacks: {} }
      })
    );
  });
  it('allows to configure excluded params', () => {
    renderSnippetConfigExtraParams({
      values: {
        xEngineId: 'motive',
        currency: 'EUR'
      },
      excludedExtraParams: ['currency', 'warehouse', 'callbacks']
    });
    const extraParamsProvidedCallback = jest.fn();
    XPlugin.bus.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);
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
  wrapper: VueWrapper;
  /** Helper method to change the snippet config. */
  setSnippetConfig: (newSnippetConfig: Dictionary<unknown>) => void | Promise<void>;
}
