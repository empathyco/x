import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent, XProvide } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import SnippetConfigExtraParams from '../snippet-config-extra-params.vue';

describe('testing snippet config extra params component', () => {
  @Component({
    template: `<div><slot/></div>`
  })
  class Provider extends Vue {
    @XProvide('snippetConfig')
    public snippetConfig: Dictionary<unknown> = {
      warehouse: 1234
    };
  }

  function renderSnippetConfigExtraParams(): RenderExtraParamsApi {
    XPlugin.resetInstance();
    const [, localVue] = installNewXPlugin();
    XPlugin.registerXModule(extraParamsXModule);

    const wrapper = mount(
      {
        template: `
          <Provider>
            <SnippetConfigExtraParams />
          </Provider>
        `,
        components: {
          Provider,
          SnippetConfigExtraParams
        }
      },
      {
        localVue
      }
    );

    function setSnippetConfig(newValue: Dictionary<unknown>): void | Promise<void> {
      const providerWrapper = wrapper.findComponent(Provider);
      return providerWrapper.setData({ snippetConfig: newValue });
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

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 1234 },
      metadata: { moduleName: 'extraParams' }
    });

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(1);

    await setSnippetConfig({ warehouse: 45678 });

    expect(extraParamsProvidedCallback).toHaveBeenCalledWith<[WirePayload<Dictionary<unknown>>]>({
      eventPayload: { warehouse: 45678 },
      metadata: { moduleName: 'extraParams' }
    });

    expect(extraParamsProvidedCallback).toHaveBeenCalledTimes(2);
  });
});

interface RenderExtraParamsApi {
  /** The wrapper for the snippet config component. */
  wrapper: Wrapper<Vue>;
  /** Helper method to change the snippet config. */
  setSnippetConfig: (newSnippetConfig: Dictionary<unknown>) => void | Promise<void>;
}
