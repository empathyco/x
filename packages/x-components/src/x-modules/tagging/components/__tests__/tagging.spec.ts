import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XComponentBusAPI } from '../../../../plugins/x-plugin.types';
import { baseSnippetConfig } from '../../../../views/base-config';
import { SnippetConfig } from '../../../../x-installer/api/api.types';
import Tagging from '../../../tagging/components/tagging.vue';

function renderTagging({
  template = `<Tagging
                :consent="consent"
                :sessionTTLMs="sessionTTLMs"
                :queryTaggingDebounceMs="queryTaggingDebounceMs"/>`,
  consent,
  sessionTTLMs,
  queryTaggingDebounceMs,
  snippetConfig = { ...baseSnippetConfig, consent }
}: RenderTaggingOptions = {}): RenderTaggingAPI {
  const [, localVue] = installNewXPlugin();
  snippetConfig = localVue.observable(snippetConfig);

  const wrapper = mount(
    {
      components: {
        Tagging
      },
      props: ['consent', 'snippetConfig', 'sessionTTLMs', 'queryTaggingDebounceMs'],
      template
    },
    {
      provide: {
        snippetConfig
      },
      propsData: {
        consent,
        queryTaggingDebounceMs,
        sessionTTLMs,
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

  it('emits ConsentProvided when the consent is set using the prop', () => {
    const { on } = renderTagging({ consent: true });
    const eventSpy = jest.fn();

    on('ConsentProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, true);
  });

  it('emits SessionDurationProvided when the session duration is set using the prop', () => {
    const { on } = renderTagging({ sessionTTLMs: 100 });
    const eventSpy = jest.fn();

    on('SessionDurationProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, 100);
  });

  it('emits QueryTaggingDebounceProvided when the query debounce is set using the prop', () => {
    const { on } = renderTagging({ queryTaggingDebounceMs: 150 });
    const eventSpy = jest.fn();

    on('QueryTaggingDebounceProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, 150);
  });

  // eslint-disable-next-line max-len
  it('emits ConsentProvided with payload false when the consent prop and the snippet config consent are undefined', () => {
    const { on } = renderTagging({
      consent: undefined,
      snippetConfig: {
        ...baseSnippetConfig,
        consent: undefined
      }
    });
    const eventSpy = jest.fn();

    on('ConsentProvided').subscribe(eventSpy);
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, false);
  });

  it('emits ConsentProvided when the consent is set using the snippet config', async () => {
    const snippet = Vue.observable<SnippetConfig>({
      ...baseSnippetConfig,
      consent: false
    });

    const { wrapper, on } = renderTagging({
      snippetConfig: snippet
    });
    const eventSpy = jest.fn();

    on('ConsentProvided').subscribe(eventSpy);
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, false);

    snippet.consent = true;
    await wrapper.vm.$nextTick();
    expect(eventSpy).toHaveBeenCalledTimes(2);
    expect(eventSpy).toHaveBeenNthCalledWith(2, true);
  });
});

interface RenderTaggingOptions {
  /** The consent value. */
  consent?: boolean;
  /** The template to be rendered. */
  template?: string;
  /** The snippet config value. */
  snippetConfig?: SnippetConfig;
  /** The session duration value. */
  sessionTTLMs?: number;
  /** The query tagging debounce value. */
  queryTaggingDebounceMs?: number;
}

interface RenderTaggingAPI {
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentBusAPI.on} method to subscribe events. */
  on: XComponentBusAPI['on'];
}
