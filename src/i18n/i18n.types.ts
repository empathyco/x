import { DeepPartial } from '@empathy/x-components';
import VueI18n from 'vue-i18n';
import { Messages } from './messages.types';

/** Supported locales. */
export type Locale = string;

/** Supported devices. */
export type Device = string;

/** Union type containing both eager and lazy messages. */
export type AnyMessages = MessagesByDevice | LoadLazyMessagesByDevice;

/** A function that loads on demand the messages for an specific locale. */
export type LoadLazyMessagesByDevice = () => Promise<{ default: MessagesByDevice }>;

/**
 * An object containing a base property with all the existing messages and the overridden ones for
 * each device.
 */
export type MessagesByDevice = { base: Messages } & {
  [device in Device]?: DeepPartial<Messages>;
};

/**
 * I18n settings.
 */
export interface I18nOptions {
  /** The initial messages. */
  messages: Record<Locale, AnyMessages>;
  /** The initial device. */
  device: Device;
  /** The locale to fall back if no matching locale is available. */
  fallbackLocale: Locale;
  /** The initial locale. */
  locale: Locale;
}

/**
 * The VueI18n instance that should be passed to the root Vue instance and some runtime utility
 * functions.
 */
export interface I18nAPI {
  /** The Vue I18n instance that should be passed to the root Vue component. */
  readonly vueI18n: Readonly<VueI18n>;
  /**
   * Sets the new locale.
   *
   * @param newLocale - The new locale.
   */
  setLocale: (newLocale: Locale) => Promise<void>;
  /**
   * Sets the new device.
   *
   * @param newDevice - The new device.
   */
  setDevice: (newDevice: Device) => Promise<void>;
}
