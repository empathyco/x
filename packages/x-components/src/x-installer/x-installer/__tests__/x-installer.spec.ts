import { computed, defineComponent, inject, nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { Store } from 'vuex';
import { PrivateXModulesOptions, XModulesOptions, XPlugin } from '../../../plugins';
import { XComponentsAdapterDummy } from '../../../__tests__/adapter.dummy';
import { AnyXModule } from '../../../x-modules/x-modules.types';
import { InitWrapper, InstallXOptions } from '../types';
import { XInstaller } from '../x-installer';
import { SnippetConfig } from '../../api/index';

const adapter = XComponentsAdapterDummy;
const xPluginMock = { install: jest.fn() };
const plugin = xPluginMock as unknown as XPlugin;
const store = {} as unknown as Store<any>;
const xModules = {} as unknown as XModulesOptions;
const __PRIVATE__xModules = {} as unknown as PrivateXModulesOptions;
const initialXModule = {} as unknown as AnyXModule;

const getMinimumSnippetConfig = (): SnippetConfig => ({
  instance: 'test',
  lang: 'test',
  scope: 'test'
});

const component = defineComponent({
  template: '<h1/>',
  setup: () => {},
  mounted: jest.fn()
});

/**
 * Creates a Vue component injecting the snippet config.
 *
 * @param snippetProperty - Property of {@link SnippetConfig} to be rendered.
 * @returns A Vue component with the injected snippet config.
 */
function createSnippetConfigComponent(snippetProperty: keyof SnippetConfig = 'instance') {
  return defineComponent({
    template: '<h1 id="snippet-config-value">{{ snippetConfigValue }}</h1>',
    setup: () => {
      const snippetConfig = inject<SnippetConfig>('snippetConfig');
      const snippetConfigValue = computed(() => snippetConfig?.[snippetProperty] ?? '');
      return { snippetConfigValue };
    }
  });
}

function getSnippetConfigComponentTextContent() {
  return document.querySelector('#snippet-config-value')?.textContent;
}

describe('testing `XInstaller` utility', () => {
  beforeEach(() => {
    delete window.initX;
    delete window.InterfaceX;
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('installs the XPlugin with all the passed plugin parameters', async () => {
    await new XInstaller({
      rootComponent: component,
      adapter,
      plugin,
      store,
      xModules,
      __PRIVATE__xModules,
      initialXModules: [initialXModule]
    }).init(getMinimumSnippetConfig());

    expect(xPluginMock.install).toHaveBeenCalledTimes(1);

    const params = xPluginMock.install.mock.calls[0][1];
    expect(params.adapter).toEqual(adapter);
    expect(params.store).toEqual(store);
    expect(params.xModules).toEqual(xModules);
    expect(params.initialXModules).toHaveLength(1);
    expect(params.initialXModules[0]).toEqual(initialXModule);
    expect(params.__PRIVATE__xModules).toEqual(__PRIVATE__xModules);
  });

  it('creates the public API in global scope by default', () => {
    new XInstaller({ rootComponent: component, adapter, plugin }).init(getMinimumSnippetConfig());

    expect(window.InterfaceX).toBeDefined();
  });

  it('does not create the public API passing the api parameter to false', () => {
    new XInstaller({ rootComponent: component, adapter, plugin, api: false }).init(
      getMinimumSnippetConfig()
    );

    expect(window.InterfaceX).not.toBeDefined();
  });

  it('creates a Vue application using the component passed in the app option', async () => {
    await new XInstaller({ rootComponent: component, adapter, plugin }).init(
      getMinimumSnippetConfig()
    );

    expect(component?.mounted).toHaveBeenCalledTimes(1);
  });

  it('allows to install more plugins', async () => {
    const { app } = await new XInstaller({
      rootComponent: component,
      adapter,
      installExtraPlugins({ app }) {
        const router = createRouter({ history: createWebHistory(), routes: [] });
        app.use(router);
      }
    }).init(getMinimumSnippetConfig());

    expect(app?.config.globalProperties).toHaveProperty('$router');
  });

  it('initializes the app with the provided snippet config', async () => {
    const rootComponent = createSnippetConfigComponent();
    const { api } = await new XInstaller({
      rootComponent,
      adapter
    }).init(getMinimumSnippetConfig());

    expect(getSnippetConfigComponentTextContent()).toEqual(getMinimumSnippetConfig().instance);

    api?.setSnippetConfig({ instance: 'test-2' });
    await nextTick();
    expect(getSnippetConfigComponentTextContent()).toEqual('test-2');
  });

  it('initializes the app when window.initX has the snippet config object', async () => {
    window.initX = getMinimumSnippetConfig();
    const { api } = (await new XInstaller({
      rootComponent: createSnippetConfigComponent(),
      adapter
    }).init()) as InitWrapper;

    expect(getSnippetConfigComponentTextContent()).toEqual(getMinimumSnippetConfig().instance);

    api?.setSnippetConfig({ instance: 'test-2' });
    await nextTick();
    expect(getSnippetConfigComponentTextContent()).toEqual('test-2');
  });

  it('should set the snippetConfig getter', async () => {
    window.initX = getMinimumSnippetConfig();
    await new XInstaller({
      rootComponent: createSnippetConfigComponent(),
      adapter
    }).init();
    const snippetConfig = window.InterfaceX?.getSnippetConfig();

    expect(snippetConfig).toEqual({
      instance: 'test',
      lang: 'test',
      scope: 'test',
      uiLang: 'test'
    });
  });

  it('initializes the app when window.initX is a function retrieving the snippet config', async () => {
    window.initX = () => getMinimumSnippetConfig();
    const { api } = (await new XInstaller({
      rootComponent: createSnippetConfigComponent(),
      adapter
    }).init()) as InitWrapper;

    expect(getSnippetConfigComponentTextContent()).toEqual(getMinimumSnippetConfig().instance);

    api?.setSnippetConfig({ instance: 'test-2' });
    await nextTick();
    expect(getSnippetConfigComponentTextContent()).toEqual('test-2');
  });

  it('does not initialize XComponents when no snippet config is passed and no window.initX is not defined', async () => {
    expect(await new XInstaller({ adapter, plugin }).init()).toBeUndefined();
  });

  describe('`lang` & `uiLang`', () => {
    it('provides a `uiLang` by default', async () => {
      await new XInstaller({
        rootComponent: createSnippetConfigComponent('uiLang'),
        adapter,
        plugin
      }).init({ ...getMinimumSnippetConfig(), lang: 'en' });

      expect(getSnippetConfigComponentTextContent()).toEqual('en');
    });

    it('respects user `uiLang` value', async () => {
      await new XInstaller({
        rootComponent: createSnippetConfigComponent('uiLang'),
        adapter,
        plugin
      }).init({ ...getMinimumSnippetConfig(), lang: 'en', uiLang: 'it' });

      expect(getSnippetConfigComponentTextContent()).toEqual('it');
    });

    it('updates `uiLang` when `lang` is changed', async () => {
      const { api } = await new XInstaller({
        rootComponent: createSnippetConfigComponent('uiLang'),
        adapter,
        plugin
      }).init({ ...getMinimumSnippetConfig(), lang: 'en', uiLang: 'it' });

      expect(getSnippetConfigComponentTextContent()).toEqual('it');

      api!.setSnippetConfig({ lang: 'es' });
      await nextTick();
      expect(getSnippetConfigComponentTextContent()).toEqual('es');

      api!.setSnippetConfig({ uiLang: 'en' });
      await nextTick();
      expect(getSnippetConfigComponentTextContent()).toEqual('en');

      api!.setSnippetConfig({ lang: 'fr', uiLang: 'it' });
      await nextTick();
      expect(getSnippetConfigComponentTextContent()).toEqual('it');
    });
  });

  describe('mounting target element', () => {
    /**
     * In Vue 2.x, when mounting an application that has a template, the rendered content replaces
     * the element we mount to.
     * In Vue 3.x, the rendered application is appended as a child of such an element, replacing
     * element's innerHTML.
     */

    const componentApp = defineComponent({
      template: '<section class="root-element" />',
      setup: () => {}
    });

    function installX(
      domElement?: InstallXOptions['domElement'],
      snippetConfig = getMinimumSnippetConfig()
    ): Promise<InitWrapper> {
      return new XInstaller({ rootComponent: componentApp, adapter, plugin, domElement }).init(
        snippetConfig
      );
    }

    it('creates an element if there is no target element indicated', async () => {
      await installX();
      expect(document.body.querySelector('div')).not.toBeNull();
      expect(document.body.querySelector('section')).not.toBeNull();
    });

    it('mounts the app on the DOM element passed as parameter', async () => {
      const domElement = document.createElement('div');
      domElement.className = 'target-element';
      document.body.appendChild(domElement);

      await installX(domElement);
      expect(document.body.querySelector('.target-element')).not.toBeNull();
      expect(document.body.querySelector('.root-element')).not.toBeNull();
    });

    it('mounts the app on the element selector passed as parameter', async () => {
      const domElement = document.createElement('div');
      domElement.className = 'target-element';
      document.body.appendChild(domElement);

      await installX('.target-element');
      expect(document.body.querySelector('.target-element')).not.toBeNull();
      expect(document.body.querySelector('.root-element')).not.toBeNull();
    });

    it("throws an error if the element selector doesn't exist in the DOM", async () => {
      await expect(async () => await installX('.no-exists')).rejects.toThrow(Error);
      expect(document.body.innerHTML).toBe('');
    });

    it(`executes a function which retrieves the DOM element based in the snippet configuration
    and on which to mount the app`, async () => {
      const snippetConfig = { ...getMinimumSnippetConfig(), wrapped: true };
      function domElement(snippetConfig: SnippetConfig): Element {
        const domElement = document.createElement('div');
        domElement.className = 'target-element';
        if (snippetConfig.wrapped) {
          const container = document.createElement('div');
          container.className = 'container-element';
          container.appendChild(domElement);
          document.body.appendChild(container);
        }
        return domElement;
      }

      await installX(domElement, snippetConfig);
      expect(document.body.querySelector('.target-element')).not.toBeNull();
      expect(document.body.querySelector('.container-element')).not.toBeNull();
      expect(document.body.querySelector('.root-element')).not.toBeNull();
    });
  });
});
