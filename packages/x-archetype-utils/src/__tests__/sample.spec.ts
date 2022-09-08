import VueI18n from 'vue-i18n';
import Vue from 'vue';
import { mount, createLocalVue, Wrapper } from '@vue/test-utils';

const TranslatedComponent = Vue.component('translatedComponent', {
  template: '<div>{{ $t("placeholder") }}</div>'
});

describe('Test i18n for several use cases', () => {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function initWrapper(component: typeof Vue): Wrapper<Vue> {
    const localVue = createLocalVue();
    localVue.use(VueI18n);
    const messages = {
      en: {
        placeholder: 'Search'
      },
      es: {
        placeholder: 'Buscar'
      }
    };
    const i18n = new VueI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages
    });
    return mount(component, {
      i18n,
      localVue
    });
  }

  it('translates component according to the default locale', () => {
    const wrapper = initWrapper(TranslatedComponent);
    const element = wrapper.find('div');
    expect(element.text()).toBe('Search');
  });

  it('changes translation according to the new locale', async () => {
    const wrapper = initWrapper(TranslatedComponent);
    wrapper.vm.$i18n.locale = 'es';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('Buscar');
  });

  it('fallbacks to the default locale if the one defined is missing', async () => {
    const wrapper = initWrapper(TranslatedComponent);
    wrapper.vm.$i18n.locale = 'null';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('Search');
  });
});
