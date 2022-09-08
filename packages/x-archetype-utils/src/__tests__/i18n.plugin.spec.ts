import Vue from 'vue';
import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import { I18n } from '../i18n/i18n.plugin';
import { Device, Locale } from '../i18n/i18n.types';

const messages = {
  en: {
    base: {
      testComponent: {
        title: 'Search products',
        'text.small': 'discover products',
        '__prices.current value asc': 'Price: Low to high'
      }
    }
  },
  es: {
    base: {
      testComponent: {
        title: 'Buscar productos'
      }
    },
    mobile: {
      testComponent: {
        title: 'Buscar'
      }
    }
  }
};

describe('Test custom i18n plugin for several use cases', () => {
  /**
   * Renders a component to test i18n plugin use cases.
   *
   * @param key - The locale key to be used in the component to get the translated text.
   * @returns The API for testing the component.
   */
  async function renderComponent(key = 'testComponent.title'): Promise<RenderComponentAPI> {
    const TestComponent = Vue.component('testComponent', {
      template: `<div>{{ $t("${key}") }}</div>`
    });
    const localVue = createLocalVue();
    const i18n = await I18n.create({
      locale: 'en',
      messages,
      device: 'desktop',
      fallbackLocale: 'en'
    });
    localVue.use(i18n);
    const setLocale = i18n.setLocale.bind(i18n);
    const setLocaleDevice = i18n.setDevice.bind(i18n);

    const wrapper = mount(TestComponent, { localVue, i18n: i18n.vueI18n });
    return { wrapper, setLocale, setLocaleDevice };
  }

  it('translates component according to the default locale', async () => {
    const { wrapper } = await renderComponent();
    expect(wrapper.text()).toBe('Search products');
  });

  it('changes translation according to the new locale and device options', async () => {
    const { wrapper, setLocale, setLocaleDevice } = await renderComponent();

    // Set a new locale and check it translates accordingly
    await setLocale('es');
    expect(wrapper.text()).toBe('Buscar productos');

    // Set a new device and check it translates accordingly
    await setLocaleDevice('mobile');
    expect(wrapper.text()).toBe('Buscar');
  });

  it('fallbacks to the default locale if the one defined is missing', async () => {
    const { wrapper, setLocale } = await renderComponent();

    await setLocale('XX');
    expect(wrapper.text()).toBe('Search products');
  });

  it("warns the key is missing if it doesn't exist for the defined locale", async () => {
    const key = 'testComponent.subtitle';
    const { wrapper } = await renderComponent(key as string);

    expect(wrapper.text()).toBe(
      `[i18n] Key '${key}' is missing for locale: '${wrapper.vm.$i18n.locale}'`
    );
  });

  it('gets message with dots in key if it exists for the defined locale', async () => {
    const key = 'testComponent.text.small';
    const { wrapper, setLocale } = await renderComponent(key);

    // Test a key with dots
    expect(wrapper.text()).toBe(`discover products`);

    // Set another locale to check that the warning is fired if the key with dots doesn't exist
    await setLocale('es');
    expect(wrapper.text()).toBe(`[i18n] Key '${key}' is missing for locale: 'es'`);
  });

  it('gets message with white space in key', async () => {
    const key = 'testComponent.__prices.current value asc';
    const { wrapper, setLocale } = await renderComponent(key);

    // Test a key with white spaces
    expect(wrapper.text()).toBe(`Price: Low to high`);

    // Set another locale to check that the warning is fired if the key with dots doesn't exist
    await setLocale('es');
    expect(wrapper.text()).toBe(`[i18n] Key '${key}' is missing for locale: 'es'`);
  });
});

interface RenderComponentAPI {
  wrapper: Wrapper<Vue>;
  setLocale: (newLocale: Locale) => Promise<void>;
  setLocaleDevice: (newDevice: Device) => Promise<void>;
}
