import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { I18nAPI, I18nOptions } from './i18n.types';
import * as messages from './messages';
import { splitMessages } from './utils';

/**
 * Initializes the i18n system, registering the {@link https://kazupon.github.io/vue-i18n/| VueI18n}
 * plugin with support for lazy loaded messages, and exposes a basic API to perform actions.
 *
 * @param options - The options to initialize the i18n.
 * @returns The initialized i18n API.
 */
export function createI18NInstance({ locale = 'en', fallbackLocale = 'en' }: I18nOptions): I18nAPI {
  Vue.use(VueI18n);
  const { immediateMessages, lazyMessages } = splitMessages(messages);

  const i18n = new VueI18n({
    locale,
    fallbackLocale,
    messages: immediateMessages
  });

  return {
    i18n,
    setLocale(locale) {
      if (locale in lazyMessages && !i18n.availableLocales.includes(locale)) {
        const importLocaleMessages = lazyMessages[locale];
        importLocaleMessages().then(({ default: localeMessages }) => {
          i18n.setLocaleMessage(locale, localeMessages);
          i18n.locale = locale;
        });
      } else {
        i18n.locale = locale;
      }
    }
  };
}
