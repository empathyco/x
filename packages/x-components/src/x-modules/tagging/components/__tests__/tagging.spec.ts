import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XComponentBusAPI } from '../../../../plugins/x-plugin.types';
import { baseSnippetConfig } from '../../../../views/base-config';
import { SnippetConfig } from '../../../../x-installer/api/api.types';
import Tagging from '../../../tagging/components/tagging.vue';
import { TaggingConfig } from '../../config.types';

function renderTagging({
  template = `<Tagging
                :consent="consent"
                :sessionTTLMs="sessionTTLMs"
                :queryTaggingDebounceMs="queryTaggingDebounceMs"
                :clickedResultStorageTTLMs="clickedResultStorageTTLMs"
                :clickedResultStorageKey="clickedResultStorageKey"
              />`,
  consent,
  sessionTTLMs,
  queryTaggingDebounceMs,
  snippetConfig = { ...baseSnippetConfig, consent },
  clickedResultStorageTTLMs,
  clickedResultStorageKey
}: RenderTaggingOptions = {}): RenderTaggingAPI {
  const [, localVue] = installNewXPlugin();
  snippetConfig = localVue.observable(snippetConfig);

  const wrapper = mount(
    {
      components: {
        Tagging
      },
      props: [
        'consent',
        'queryTaggingDebounceMs',
        'sessionTTLMs',
        'snippetConfig',
        'clickedResultStorageTTLMs',
        'clickedResultStorageKey'
      ],
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
        snippetConfig,
        clickedResultStorageTTLMs,
        clickedResultStorageKey
      },
      localVue
    }
  );

  return {
    wrapper: wrapper.findComponent(Tagging),
    on: wrapper.vm.$x.on.bind(wrapper.vm.$x)
  };
}
const defaultTaggingConfig: Partial<TaggingConfig> = {
  clickedResultStorageTTLMs: 30000,
  clickedResultStorageKey: 'url'
};
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

  it('emits TaggingConfigProvided when the session duration is set using the prop', () => {
    const { on } = renderTagging({ sessionTTLMs: 100 });
    const eventSpy = jest.fn();

    on('TaggingConfigProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, { ...defaultTaggingConfig, sessionTTLMs: 100 });
  });

  it('emits TaggingConfigProvided when the query debounce is set using the prop', () => {
    const { on } = renderTagging({ queryTaggingDebounceMs: 150 });
    const eventSpy = jest.fn();

    on('TaggingConfigProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...defaultTaggingConfig,
      queryTaggingDebounceMs: 150
    });
  });

  it('emits TaggingConfigProvided when clicked result storage ttl is set using the prop', () => {
    const { on } = renderTagging({ clickedResultStorageTTLMs: 150 });
    const eventSpy = jest.fn();

    on('TaggingConfigProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...defaultTaggingConfig,
      clickedResultStorageTTLMs: 150
    });
  });

  it('emits TaggingConfigProvided when clicked result storage key is set using the prop', () => {
    const { on } = renderTagging({ clickedResultStorageKey: 'id' });
    const eventSpy = jest.fn();

    on('TaggingConfigProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      ...defaultTaggingConfig,
      clickedResultStorageKey: 'id'
    });
  });

  // eslint-disable-next-line max-len
  it('emits TaggingConfigProvided only once when multiple tagging config are set using the props', () => {
    const { on } = renderTagging({
      clickedResultStorageKey: 'id',
      clickedResultStorageTTLMs: 150,
      queryTaggingDebounceMs: 150,
      sessionTTLMs: 100
    });
    const eventSpy = jest.fn();

    on('TaggingConfigProvided').subscribe(eventSpy);

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      clickedResultStorageKey: 'id',
      clickedResultStorageTTLMs: 150,
      queryTaggingDebounceMs: 150,
      sessionTTLMs: 100
    });
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
    const snippet = {
      ...baseSnippetConfig,
      consent: false
    };

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
  /** The query tagging debounce value. */
  queryTaggingDebounceMs?: number;
  /** The snippet config value. */
  snippetConfig?: SnippetConfig;
  /** The session duration value. */
  sessionTTLMs?: number;
  /** The template to be rendered. */
  template?: string;
  /** Time in milliseconds to keep the information for a result clicked by the user. */
  clickedResultStorageTTLMs?: number;
  /** The id ot use for storing the information. */
  clickedResultStorageKey?: string;
}

interface RenderTaggingAPI {
  /** The {@link XComponentBusAPI.on} method to subscribe events. */
  on: XComponentBusAPI['on'];
  /** The wrapper of the container element. */
  wrapper: Wrapper<Vue>;
}
