import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { WirePayload } from '../../../../wiring';
import { UrlConfig } from '../../config.types';
import { UrlHandler } from '../index';

/**
 * Renders the {@link UrlHandler} component, exposing a basic API for testing.
 *
 * @returns The API for testing the {@link UrlHandler} component.
 */
function renderUrlHandler({ template = `<UrlHandler />` }: UrlHandlerOptions = {}): UrlHandlerAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      template,
      components: {
        UrlHandler
      }
    },
    {
      localVue
    }
  );

  return {
    wrapper: wrapper.findComponent(UrlHandler)
  };
}

describe('testing UrlHandler component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderUrlHandler();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('url');
  });

  // eslint-disable-next-line max-len
  it("doesn't emit the `UrlConfigProvided` if there are not custom keys keys when its created", () => {
    const { wrapper } = renderUrlHandler();

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('UrlConfigProvided', true).subscribe(urlHandlerProvidedCallback);

    expect(urlHandlerProvidedCallback).not.toHaveBeenCalled();
  });

  it('emits the `UrlConfigProvided` event with the custom keys when its created', () => {
    const { wrapper } = renderUrlHandler({
      template: `<UrlHandler query="query" page="p" />`
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

  it('emits the `DocumentLoaded` when the window is loaded', () => {
    const { wrapper } = renderUrlHandler();

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('DocumentLoaded', false).subscribe(urlHandlerProvidedCallback);

    window.dispatchEvent(new Event('load'));

    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });

  it('emits the `DocumentHistoryChanged` when the url change', () => {
    const { wrapper } = renderUrlHandler();

    const urlHandlerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('DocumentHistoryChanged', false).subscribe(urlHandlerProvidedCallback);

    window.dispatchEvent(new Event('popstate'));

    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });
});

interface UrlHandlerAPI {
  /** Test wrapper of the {@link UrlHandler} instance. */
  wrapper: Wrapper<Vue>;
}

interface UrlHandlerOptions {
  /** The template to render. Receives the `params` via prop. */
  template?: string;
}
