import { createI18NInstance } from '@/i18n';
import { InstallXOptions } from '@empathy/x-components';
import App from '../App.vue';
import store from '../store';
import { adapter } from './adapter';

const { i18n, setLocale } = createI18NInstance({ locale: 'en' });

(window as any)['setLocale'] = setLocale; // Only for testing

export const installXOptions: InstallXOptions = {
  adapter,
  store,
  app: App,
  vueOptions: {
    i18n
  }
};
