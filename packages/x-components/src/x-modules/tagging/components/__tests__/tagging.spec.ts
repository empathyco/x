import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { Component, Prop, Provide } from 'vue-property-decorator';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XComponentBusAPI } from '../../../../plugins/x-plugin.types';
import { baseSnippetConfig } from '../../../../views/base-config';
import { SnippetConfig } from '../../../../x-installer/api/api.types';
import Tagging from '../../../tagging/components/tagging.vue';

@Component({
  template: `<div><slot/></div>`
})
class Provider extends Vue {
  @Prop({ default: baseSnippetConfig })
  @Provide()
  public snippetConfig!: SnippetConfig;
}

function renderTagging({
  template = `<Provider :snippetConfig="snippetConfig"><Tagging :consent="consent"/></Provider>`,
  consent = undefined,
  snippetConfig = baseSnippetConfig
}: RenderTaggingOptions = {}): RenderTaggingAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      components: {
        Tagging,
        Provider
      },
      props: ['consent', 'snippetConfig'],
      template
    },
    {
      propsData: {
        consent,
        snippetConfig
      },
      localVue
    }
  );

  return {
    wrapper: wrapper.findComponent(Tagging),
    on: wrapper.vm.$x.on.bind(wrapper.vm.$x)
  };
}

describe('testing Tagging component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderTagging();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('tagging');
  });

  it('emits ConsentProvided when the consent is set and send it by prop', () => {
    const { on } = renderTagging({ consent: true });
    const eventSpy = jest.fn();

    on('ConsentProvided').subscribe(eventSpy);
    expect(eventSpy).toHaveBeenNthCalledWith(1, true);
  });

  it("doesn't emit ConsentProvided when the consent is undefined send it by prop", () => {
    const { on } = renderTagging();
    const eventSpy = jest.fn();

    on('ConsentProvided').subscribe(eventSpy);
    expect(eventSpy).not.toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('emits ConsentProvided when the consent is provided and send it using the snippet config', async () => {
    const snippet = Vue.observable({
      ...baseSnippetConfig,
      consent: false
    } as SnippetConfig & { consent?: boolean });
    const { wrapper, on } = renderTagging({
      snippetConfig: snippet
    });
    const eventSpy = jest.fn();

    on('ConsentProvided').subscribe(eventSpy);
    expect(eventSpy).not.toHaveBeenCalled();

    snippet.consent = true;
    await wrapper.vm.$nextTick();
    expect(eventSpy).toHaveBeenNthCalledWith(1, true);

    snippet.consent = false;
    await wrapper.vm.$nextTick();
    expect(eventSpy).toHaveBeenNthCalledWith(2, false);

    snippet.consent = undefined;
    await wrapper.vm.$nextTick();
    expect(eventSpy).toHaveBeenCalledTimes(2);
  });
});

interface RenderTaggingOptions {
  /** The consent value. */
  consent?: boolean;
  /** The template to be rendered. */
  template?: string;
  /** The snippet config value. */
  snippetConfig?: SnippetConfig;
}

interface RenderTaggingAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentBusAPI.on} method to subscribe events. */
  on: XComponentBusAPI['on'];
}
