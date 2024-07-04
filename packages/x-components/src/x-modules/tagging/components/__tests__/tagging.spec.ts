import { mount } from '@vue/test-utils';
import Vue from 'vue';
import { Dictionary } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { baseSnippetConfig } from '../../../../views/base-config';
import Tagging from '../../../tagging/components/tagging.vue';
import { TaggingConfig } from '../../config.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { XPlugin } from '../../../../plugins/x-plugin';

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
  snippetConsent,
  clickedResultStorageTTLMs,
  clickedResultStorageKey,
  productId
}: RenderTaggingOptions = {}) {
  const [, localVue] = installNewXPlugin();
  const snippetConfig = Vue.observable({
    ...baseSnippetConfig,
    consent: snippetConsent,
    productId
  });

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

  const onConsentProvided = jest.fn();
  XPlugin.bus.on('ConsentProvided', true).subscribe(onConsentProvided);

  const onTaggingConfigProvided = jest.fn();
  XPlugin.bus.on('TaggingConfigProvided', true).subscribe(onTaggingConfigProvided);

  const onPDPIsLoaded = jest.fn();
  XPlugin.bus.on('PDPIsLoaded', true).subscribe(onPDPIsLoaded);

  function setSnippetConfig(newValue: Dictionary<unknown>): Promise<void> {
    Object.assign(snippetConfig, newValue);
    return localVue.nextTick();
  }

  return {
    wrapper: wrapper.findComponent(Tagging),
    onConsentProvided,
    onTaggingConfigProvided,
    onPDPIsLoaded,
    setSnippetConfig
  };
}

const defaultTaggingConfig: Partial<TaggingConfig> = {
  clickedResultStorageTTLMs: 30000,
  clickedResultStorageKey: 'url'
};

const stubTagginMetadata: WireMetadata = {
  moduleName: 'tagging',
  location: 'none',
  replaceable: true
};

describe('testing Tagging component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderTagging();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('tagging');
  });

  it('emits ConsentProvided when the consent is set using the prop', () => {
    const { onConsentProvided } = renderTagging({ consent: true });

    expect(onConsentProvided).toHaveBeenCalledTimes(1);
    expect(onConsentProvided).toHaveBeenCalledWith({
      eventPayload: true,
      metadata: stubTagginMetadata
    });
  });

  it('emits TaggingConfigProvided when the session duration is set using the prop', () => {
    const { onTaggingConfigProvided } = renderTagging({ sessionTTLMs: 100 });

    expect(onTaggingConfigProvided).toHaveBeenCalledTimes(1);
    expect(onTaggingConfigProvided).toHaveBeenCalledWith({
      eventPayload: {
        ...defaultTaggingConfig,
        sessionTTLMs: 100
      },
      metadata: stubTagginMetadata
    });
  });

  it('emits TaggingConfigProvided when the query debounce is set using the prop', () => {
    const { onTaggingConfigProvided } = renderTagging({ queryTaggingDebounceMs: 150 });

    expect(onTaggingConfigProvided).toHaveBeenCalledTimes(1);
    expect(onTaggingConfigProvided).toHaveBeenCalledWith({
      eventPayload: {
        ...defaultTaggingConfig,
        queryTaggingDebounceMs: 150
      },
      metadata: stubTagginMetadata
    });
  });

  it('emits TaggingConfigProvided when clicked result storage ttl is set using the prop', () => {
    const { onTaggingConfigProvided } = renderTagging({ clickedResultStorageTTLMs: 150 });

    expect(onTaggingConfigProvided).toHaveBeenCalledTimes(1);
    expect(onTaggingConfigProvided).toHaveBeenCalledWith({
      eventPayload: {
        ...defaultTaggingConfig,
        clickedResultStorageTTLMs: 150
      },
      metadata: stubTagginMetadata
    });
  });

  it('emits TaggingConfigProvided when clicked result storage key is set using the prop', () => {
    const { onTaggingConfigProvided } = renderTagging({ clickedResultStorageKey: 'id' });

    expect(onTaggingConfigProvided).toHaveBeenCalledTimes(1);
    expect(onTaggingConfigProvided).toHaveBeenCalledWith({
      eventPayload: {
        ...defaultTaggingConfig,
        clickedResultStorageKey: 'id'
      },
      metadata: stubTagginMetadata
    });
  });

  // eslint-disable-next-line max-len
  it('emits TaggingConfigProvided only once when multiple tagging config are set using the props', () => {
    const { onTaggingConfigProvided } = renderTagging({
      clickedResultStorageKey: 'id',
      clickedResultStorageTTLMs: 150,
      queryTaggingDebounceMs: 150,
      sessionTTLMs: 100
    });

    expect(onTaggingConfigProvided).toHaveBeenCalledTimes(1);
    expect(onTaggingConfigProvided).toHaveBeenCalledWith({
      eventPayload: {
        clickedResultStorageKey: 'id',
        clickedResultStorageTTLMs: 150,
        queryTaggingDebounceMs: 150,
        sessionTTLMs: 100
      },
      metadata: stubTagginMetadata
    });
  });

  // eslint-disable-next-line max-len
  it('emits ConsentProvided with payload false when the consent prop and the snippet config consent are undefined', () => {
    const { onConsentProvided } = renderTagging({
      consent: undefined,
      snippetConsent: undefined
    });

    expect(onConsentProvided).toHaveBeenCalledTimes(1);
    expect(onConsentProvided).toHaveBeenCalledWith({
      eventPayload: false,
      metadata: stubTagginMetadata
    });
  });

  it('emits ConsentProvided when the consent is set using the snippet config', async () => {
    const { onConsentProvided, setSnippetConfig } = renderTagging({ snippetConsent: false });

    expect(onConsentProvided).toHaveBeenCalledTimes(1);
    expect(onConsentProvided).toHaveBeenCalledWith({
      eventPayload: false,
      metadata: stubTagginMetadata
    });

    await setSnippetConfig({ consent: true });

    expect(onConsentProvided).toHaveBeenCalledTimes(2);
    expect(onConsentProvided).toHaveBeenCalledWith({
      eventPayload: true,
      metadata: stubTagginMetadata
    });
  });

  it('emits PDPIsLoaded when the product id is set in the snippet config', () => {
    const { onPDPIsLoaded } = renderTagging({ productId: 'fake-product-id' });

    expect(onPDPIsLoaded).toHaveBeenCalledTimes(1);
    expect(onPDPIsLoaded).toHaveBeenCalledWith({
      eventPayload: 'fake-product-id',
      metadata: stubTagginMetadata
    });
  });
});

interface RenderTaggingOptions {
  /** The consent value. */
  consent?: boolean;
  /** The query tagging debounce value. */
  queryTaggingDebounceMs?: number;
  /** The snippet consent value. */
  snippetConsent?: boolean;
  /** The session duration value. */
  sessionTTLMs?: number;
  /** The template to be rendered. */
  template?: string;
  /** Time in milliseconds to keep the information for a result clicked by the user. */
  clickedResultStorageTTLMs?: number;
  /** The id ot use for storing the information. */
  clickedResultStorageKey?: string;
  /** The id for a product. */
  productId?: string;
}
