import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { WirePayload } from '../../../../wiring';
import { UrlConfig } from '../../config.types';
import { urlXModule } from '../../x-module';
import { URLManager } from '../index';

/**
 * Renders the {@link URLManager} component, exposing a basic API for testing.
 *
 * @returns The API for testing the {@link URLManager} component.
 */
function renderURLManager({ template = `<URLManager />` }: URLManagerOptions = {}): URLManagerAPI {
  XPlugin.resetInstance();
  const [, localVue] = installNewXPlugin();
  XPlugin.registerXModule(urlXModule);
  const wrapper = mount(
    {
      template,
      components: {
        URLManager
      }
    },
    {
      localVue
    }
  );

  return {
    wrapper: wrapper.findComponent(URLManager)
  };
}

describe('testing URLManager component', () => {
  it('is an x-component', () => {
    const { wrapper } = renderURLManager();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `url` x-module', () => {
    const { wrapper } = renderURLManager();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('url');
  });

  // eslint-disable-next-line max-len
  it("doesn't emit the `UrlConfigProvided` if there are not custom keys keys when its created", () => {
    const { wrapper } = renderURLManager();

    const urlManagerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('UrlConfigProvided', true).subscribe(urlManagerProvidedCallback);

    expect(urlManagerProvidedCallback).not.toHaveBeenCalled();
  });

  it('emits the `UrlConfigProvided` event with the custom keys when its created', () => {
    const { wrapper } = renderURLManager({
      template: `<URLManager query="query" page="p" />`
    });

    const urlManagerProvidedCallback = jest.fn();

    wrapper.vm.$x.on('UrlConfigProvided', true).subscribe(urlManagerProvidedCallback);

    expect(urlManagerProvidedCallback).toHaveBeenCalledWith<[WirePayload<UrlConfig>]>({
      eventPayload: {
        urlParamNames: {
          query: 'query',
          page: 'p'
        }
      },
      metadata: { moduleName: 'url' }
    });
    expect(urlManagerProvidedCallback).toHaveBeenCalledTimes(1);
  });
});

interface URLManagerAPI {
  /** Test wrapper of the {@link URLManager} instance. */
  wrapper: Wrapper<Vue>;
}

interface URLManagerOptions {
  template?: string;
}
