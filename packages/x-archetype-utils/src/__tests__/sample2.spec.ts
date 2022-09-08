import Vue from 'vue';
import { mount, createLocalVue, Wrapper } from '@vue/test-utils';
import { I18n } from '../i18n/i18n.plugin';

const messages = {
  en: {
    base: {
      placeholder: 'Search'
    }
  },
  es: {
    base: {
      placeholder: 'Buscar'
    }
  }
};

const TranslatedComponent = Vue.component('translatedComponent', {
  template: '<div>{{ $t("placeholder") }}</div>'
});

describe('Test custom i18n plugin for several use cases', () => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function renderComponent(component: typeof Vue): Wrapper<Vue> {
    const localVue = createLocalVue();
    const i18n = new I18n({
      locale: 'en',
      messages,
      device: 'desktop',
      fallbackLocale: 'en'
    });
    localVue.use(i18n);
    return mount(component, { i18n: i18n.vueI18n });
  }

  it('translates component according to the default locale', () => {
    const wrapper = renderComponent(TranslatedComponent);
    expect(wrapper.text()).toBe('Search');
  });

  it('changes translation according to the new locale', async () => {
    const wrapper = renderComponent(TranslatedComponent);
    wrapper.vm.$i18n.locale = 'es';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('Buscar');
  });
});
