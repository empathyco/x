import VueI18n, { LocaleMessageObject } from 'vue-i18n';

/**
 * Interface to split messages depending on whether they are loaded synchronously or asynchronously.
 */
export interface SplitMessages {
  /**
   * Messages that will be included in the main chunk of the app, and will be loaded as soon as
   * possible.
   */
  immediateMessages: ImmediateMessages;
  /**
   * Messages that will only be loaded on demand.
   */
  lazyMessages: LazyMessages;
}

/** Messages included in the main chunk of the app. */
export type ImmediateMessages = Record<string, LocaleMessageObject>;

/** Messages loaded on demand, asynchronously. */
export type LazyMessages = Record<string, LazyMessage>;

/** A function to load the messages for an specific locale on demand. */
export type LazyMessage = () => Promise<{ default: LocaleMessageObject }>;

/**
 * Options for configuring the i18n.
 */
export interface I18nOptions {
  /** The initial locale. */
  locale: string;
  /** The locale to fall back if no matching locale is available. */
  fallbackLocale?: string;
}

/**
 * The i18n API contains the VueI18n instance that should be passed to the root Vue instance and
 * some runtime utility functions.
 */
export interface I18nAPI {
  /** The Vue I18n instance that should be passed to the root Vue component. */
  readonly i18n: Readonly<VueI18n>;
  /**
   * Sets the locale to the one provided. If the locale is not available, it tries to request it
   * using a dynamic import.
   *
   * @param locale - The new locale to set.
   */
  setLocale(locale: string): void;
}
