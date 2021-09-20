import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XComponentAPI } from '../../../../plugins/x-plugin.types';
import { WirePayload } from '../../../../wiring';
import { UrlConfig } from '../../config.types';
import { urlXModule } from '../../x-module';
import { UrlHandler } from '../index';

/**
 * Renders the {@link UrlHandler} component, exposing a basic API for testing.
 *
 * @returns The API for testing the {@link UrlHandler} component.
 */
function renderUrlHandler({ template = `<UrlHandler />` }: UrlHandlerOptions = {}): UrlHandlerAPI {
  const [, localVue] = installNewXPlugin({ initialXModules: [urlXModule] });

  const wrapperTemplate = mount(
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
  const wrapper = wrapperTemplate.findComponent(UrlHandler);
  const $x = wrapperTemplate.vm.$x;
  return {
    wrapper,
    $x
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
    const { $x } = renderUrlHandler();

    const urlHandlerProvidedCallback = jest.fn();

    $x.on('UrlConfigProvided').subscribe(urlHandlerProvidedCallback);

    expect(urlHandlerProvidedCallback).not.toHaveBeenCalled();
  });

  it('emits the `UrlConfigProvided` event with the custom keys when its created', () => {
    const { $x } = renderUrlHandler({
      template: `<UrlHandler query="query" page="p" />`
    });

    const urlHandlerProvidedCallback = jest.fn();

    $x.on('UrlConfigProvided', true).subscribe(urlHandlerProvidedCallback);

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
    const { $x } = renderUrlHandler();

    const urlHandlerProvidedCallback = jest.fn();

    $x.on('DocumentLoaded').subscribe(urlHandlerProvidedCallback);

    window.dispatchEvent(new Event('load'));

    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });

  it('emits the `DocumentHistoryChanged` when the url change', () => {
    const { $x } = renderUrlHandler();

    const urlHandlerProvidedCallback = jest.fn();

    $x.on('DocumentHistoryChanged').subscribe(urlHandlerProvidedCallback);

    window.dispatchEvent(new Event('popstate'));

    expect(urlHandlerProvidedCallback).toHaveBeenCalledTimes(1);
  });

  it('emits the different events with the state values when the document is loaded', () => {
    const url = new URL(
      window.location.href + '?query=sudadera&relatedTags=capucha&relatedTags=disney'
    );

    window.history.pushState({ ...window.history.state }, document.title, url.href);

    const { $x } = renderUrlHandler();

    const queryLoadedFromUrl = jest.fn();
    const relatedTagsLoadedFromUrl = jest.fn();

    $x.on('QueryLoadedFromUrl').subscribe(queryLoadedFromUrl);
    $x.on('RelatedTagsLoadedFromUrl').subscribe(relatedTagsLoadedFromUrl);

    window.dispatchEvent(new Event('load'));

    expect(queryLoadedFromUrl).toHaveBeenCalledTimes(1);
    expect(relatedTagsLoadedFromUrl).toHaveBeenCalledTimes(1);
  });
});

interface UrlHandlerAPI {
  /** Test wrapper of the {@link UrlHandler} instance. */
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentAPI} used by the rendered {@link UrlHandler}. */
  $x: XComponentAPI;
}

interface UrlHandlerOptions {
  /** The template to render. Receives the `params` via prop. */
  template?: string;
}
