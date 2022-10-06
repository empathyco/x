import VueI18n from 'vue-i18n';
import { DeepPartial } from '@empathyco/x-utils';

/** Supported locales. */
export type Locale = string;

/** Supported devices. */
export type Device = string;

/** Union type containing both eager and lazy messages. */
export type AnyMessages<SomeMessages> =
  | MessagesByDevice<SomeMessages>
  | LoadLazyMessagesByDevice<SomeMessages>;

/** A function that loads on demand the messages for a specific locale. */
export type LoadLazyMessagesByDevice<SomeMessages> = () => Promise<{
  default: MessagesByDevice<SomeMessages>;
}>;

/**
 * An object containing a base property with all the existing messages and the overridden ones for
 * each device.
 */
export interface MessagesByDevice<SomeMessages> {
  base: SomeMessages;
  [device: Device]: DeepPartial<SomeMessages>;
}

/**
 * I18n settings.
 */
export interface I18nOptions<SomeMessages> {
  /** The initial messages. */
  messages: Record<Locale, AnyMessages<SomeMessages>>;
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
