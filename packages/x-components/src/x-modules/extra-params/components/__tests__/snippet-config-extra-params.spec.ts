import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import SnippetConfigExtraParams from '../snippet-config-extra-params.vue';

describe('testing snippet config extra params component', () => {
  function renderSnippetConfigExtraParams(): RenderExtraParamsApi {
    XPlugin.resetInstance();
    const [, localVue] = installNewXPlugin();
    XPlugin.registerXModule(extraParamsXModule);
    const snippetConfig = Vue.observable({ warehouse: 1234, callbacks: {} });

    const wrapper = mount(
      {
        template: `
            <SnippetConfigExtraParams />
        `,
        components: {
          SnippetConfigExtraParams
        },
        provide() {
          return {
            snippetConfig
          };
        }
      },
      {
        localVue
      }
    );

    function setSnippetConfig(newValue: Dictionary<unknown>): Promise<void> {
      Object.assign(snippetConfig, newValue);
      return localVue.nextTick();
    }

    return {
      wrapper: wrapper.findComponent(SnippetConfigExtraParams),
      setSnippetConfig
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderSnippetConfigExtraParams();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  // eslint-disable-next-line max-len
  it('emits the ExtraParamsProvided event when the component is loaded and when the snippet config changes', async () => {
    const { wrapper, setSnippetConfig } = renderSnippetConfigExtraParams();
    const extraParamsProvidedCallback = jest.fn();

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234 }
      })
    );

    await setSnippetConfig({ warehouse: 45678 });

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      2,
      expect.objectContaining({
        eventPayload: { warehouse: 45678 }
      })
    );
  });

  // eslint-disable-next-line max-len
  it('not emits the ExtraParamsProvided event when any no extra params in the snippet config changes', async () => {
    const { wrapper, setSnippetConfig } = renderSnippetConfigExtraParams();
    const extraParamsProvidedCallback = jest.fn();

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.objectContaining({
        eventPayload: { warehouse: 1234 }
      })
    );

    await setSnippetConfig({ lang: 'es' });

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
    const { wrapper } = renderSnippetConfigExtraParams();
    const extraParamsProvidedCallback = jest.fn();

    wrapper.vm.$x.on('ExtraParamsProvided', true).subscribe(extraParamsProvidedCallback);

    expect(extraParamsProvidedCallback).toHaveBeenNthCalledWith<[WirePayload<Dictionary<unknown>>]>(
      1,
      expect.not.objectContaining({
        eventPayload: { callbacks: {} }
      })
    );
  });
});

interface RenderExtraParamsApi {
  /** The wrapper for the snippet config component. */
  wrapper: Wrapper<Vue>;
  /** Helper method to change the snippet config. */
  setSnippetConfig: (newSnippetConfig: Dictionary<unknown>) => void | Promise<void>;
}
