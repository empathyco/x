import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { WirePayload } from '../../../../wiring';
import { UrlConfig } from '../../config.types';
import { URLHandler } from '../index';

jest.useFakeTimers();

/**
 * Renders the {@link URLHandler} component, exposing a basic API for testing.
 *
 * @returns The API for testing the {@link URLHandler} component.
 */
function renderURLHandler({ template = `<URLHandler />` }: URLHandlerOptions = {}): URLHandlerAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      template,
      components: {
        URLHandler
      }
    },
    {
      localVue
    }
  );

  async function executeWindowEvent(event: string): Promise<void> {
    window.dispatchEvent(new Event(event));
    jest.runAllTimers();
    await wrapper.vm.$nextTick();
  }

  return {
    wrapper: wrapper.findComponent(URLHandler),
    executeWindowEvent
  };
}

describe('testing URLHandler component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderURLHandler();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('url');
  });

  // eslint-disable-next-line max-len
  it("doesn't emit the `UrlConfigProvided` if there are not custom keys keys when its created", () => {
    const { wrapper } = renderURLHandler();

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('UrlConfigProvided', true).subscribe(urlHandlerProvidedCallback);

    expect(urlHandlerProvidedCallback).not.toHaveBeenCalled();
  });

  it('emits the `UrlConfigProvided` event with the custom keys when its created', () => {
    const { wrapper } = renderURLHandler({
      template: `<URLHandler query="query" page="p" />`
    });

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('UrlConfigProvided', true).subscribe(urlHandlerProvidedCallback);

    expect(urlHandlerProvidedCallback).toHaveBeenCalledWith<[WirePayload<UrlConfig>]>({
      eventPayload: {
        urlParamNames: {
          query: 'query',
          page: 'p'
        }
      },
      metadata: { moduleName: 'url' }
    });
    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });

  it('emits the `DocumentLoaded` when the window is loaded', async () => {
    const { wrapper, executeWindowEvent } = renderURLHandler();

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('DocumentLoaded', false).subscribe(urlHandlerProvidedCallback);

    await executeWindowEvent('load');

    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });

  it('emits the `DocumentHistoryChanged` when the url change', async () => {
    const { wrapper, executeWindowEvent } = renderURLHandler();

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('DocumentHistoryChanged', false).subscribe(urlHandlerProvidedCallback);

    await executeWindowEvent('popstate');

    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });
});

interface URLHandlerAPI {
  /** Test wrapper of the {@link URLHandler} instance. */
  wrapper: Wrapper<Vue>;
  /** Simulates window events for testing. */
  executeWindowEvent: (event: string) => Promise<void>;
}

interface URLHandlerOptions {
  /** The template to render. Receives the `params` via prop. */
  template?: string;
}
