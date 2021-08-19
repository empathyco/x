import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent, XProvide } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { Dictionary } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
import { extraParamsXModule } from '../../x-module';
import SnippetConfigExtraRequestParams from '../snippet-config-extra-params.vue';

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
            <SnippetConfigExtraRequestParams />
          </Provider>
        `,
        components: {
          Provider,
          SnippetConfigExtraRequestParams
        }
      },
      {
        localVue
      }
    );

    return {
      wrapper: wrapper.findComponent(SnippetConfigExtraRequestParams)
    };
  }

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderSnippetConfigExtraParams();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('extraParams');
  });

  it('emits the ExtraRequestParamsProvided event', () => {
    const { wrapper } = renderSnippetConfigExtraParams();
    const extraRequestParamsProvidedCallback = jest.fn();

    wrapper.vm.$x
      .on('ExtraRequestParamsProvided', true)
      .subscribe(extraRequestParamsProvidedCallback);

    expect(extraRequestParamsProvidedCallback).toHaveBeenCalledWith<
      [WirePayload<Dictionary<unknown>>]
    >({
      eventPayload: { warehouse: 1234 },
      metadata: { moduleName: 'extraParams' }
    });

    expect(extraRequestParamsProvidedCallback).toHaveBeenCalledTimes(1);
  });
});

interface RenderExtraParamsApi {
  /** The wrapper for the extra params component. */
  wrapper: Wrapper<Vue>;
}
