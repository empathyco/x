import { DeepPartial } from '@empathyco/x-utils';
import Vue from 'vue';
import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import { I18n } from '../i18n/i18n.plugin';
import { Device, I18nOptions, Locale } from '../i18n/i18n.types';

interface Messages {
  testComponent: {
    title: string;
    'text.small': string;
    '__prices.current value asc': string;
  };
}

describe('Test custom i18n plugin for several use cases', () => {
  /**
   * Renders a component to test i18n plugin use cases.
   *
   * @param i18nOptions - The options object for configuring the i18n instance.
   * @param key - The locale key to be used in the component to get the translated text.
   * @returns The API for testing the component.
   */
  async function renderComponent(
    i18nOptions: Partial<I18nOptions<DeepPartial<Messages>>> = {},
    key = 'testComponent.title'
  ): Promise<RenderComponentAPI> {
    const TestComponent = Vue.component('testComponent', {
      template: `<div>{{ $t("${key}") }}</div>`
    });
    const localVue = createLocalVue();
    const i18n = await I18n.create({
      locale: 'en',
      messages: {
        en: {
          base: {
            testComponent: {
              title: 'Search products'
            }
          }
        }
      },
      device: 'desktop',
      fallbackLocale: 'en',
      ...i18nOptions
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
    const { wrapper, setLocale, setLocaleDevice } = await renderComponent({
      messages: {
        en: {
          base: {}
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
      }
    });

    await setLocale('es');
    expect(wrapper.text()).toBe('Buscar productos');

    await setLocaleDevice('mobile');
    expect(wrapper.text()).toBe('Buscar');
  });

  it('fallbacks to the default locale if the one defined is missing', async () => {
    const { wrapper } = await renderComponent({
      locale: 'es'
    });

    expect(wrapper.text()).toBe('Search products');
  });

  it("warns the key is missing if it doesn't exist for the defined locale", async () => {
    const key = 'testComponent.subtitle';
    const { wrapper } = await renderComponent({}, key);

    expect(wrapper.text()).toBe(
      `[i18n] Key '${key}' is missing for locale: '${wrapper.vm.$i18n.locale}'`
    );
  });

  it('gets message with dots in key if it exists for the defined locale', async () => {
    const key = 'testComponent.text.small';
    const { wrapper, setLocale } = await renderComponent(
      {
        messages: {
          en: {
            base: {
              testComponent: {
                'text.small': 'discover products'
              }
            }
          },
          es: {
            base: {}
          }
        }
      },
      key
    );

    expect(wrapper.text()).toBe(`discover products`);

    // Set another locale to check that the warning is fired if the key with dots doesn't exist
    await setLocale('es');
    expect(wrapper.text()).toBe(`[i18n] Key '${key}' is missing for locale: 'es'`);
  });

  it('gets message with white space in key', async () => {
    const key = 'testComponent.__prices.current value asc';
    const { wrapper, setLocale } = await renderComponent(
      {
        messages: {
          en: {
            base: {
              testComponent: {
                '__prices.current value asc': 'Price: Low to high'
              }
            }
          },
          es: {
            base: {}
          }
        }
      },
      key
    );

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
