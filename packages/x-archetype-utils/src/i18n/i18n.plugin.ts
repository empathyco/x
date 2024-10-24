import { isObject } from '@empathyco/x-utils';
import { App } from 'vue';
import { createI18n, LocaleMessageObject, I18n as VueI18n } from 'vue-i18n';
import { deepMerge } from '@empathyco/x-deep-merge';
import { AnyMessages, Device, I18nOptions, LoadLazyMessagesByDevice, Locale } from './i18n.types';

/**
 * I18n settings manager.
 *
 * @public
 */
export class I18n<SomeMessages> {
  public vueI18n!: VueI18n;
  protected locale!: Locale;
  protected device!: Device;
  protected messages!: Record<Locale, AnyMessages<SomeMessages>>;
  protected currentMessages!: LocaleMessageObject;
  protected fallbackLocale!: Locale;

  /**
   * Constructs a new {@link I18n} instance with the passed {@link I18nOptions | i18n options}.
   *
   * @param options - The new {@link I18nOptions | i18n options}.
   */
  public constructor({ locale, messages, device, fallbackLocale }: I18nOptions<SomeMessages>) {
    this.locale = locale;
    this.device = device;
    this.messages = messages;
    this.fallbackLocale = fallbackLocale;
  }

  /**
   * Creates a new {@link I18n} instance.
   *
   * @param options - The new {@link I18nOptions | i18n options}.
   *
   * @returns The new instance.
   */
  static async create<SomeMessages>(
    options: I18nOptions<SomeMessages>
  ): Promise<I18n<SomeMessages>> {
    const instance = new I18n(options);
    instance.currentMessages = await instance.getCurrentMessages();
    return instance;
  }

  /**
   * Installs VueI18n plugin.
   *
   * @param vue - The Vue instance.
   */
  install(vue: App): void {
    this.vueI18n = createI18n({
      locale: this.locale,
      silentFallbackWarn: true,
      messages: this.currentMessages ? ({ [this.locale]: this.currentMessages } as any) : {},
      missing: (_, key: string) => {
        return (
          this.getMessageWithDotsInKey(key) ??
          `[i18n] Key '${key}' is missing for locale: '${this.locale}'`
        );
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    vue.use(this.vueI18n);
  }

  /**
   * Tries to get a value from the messages object accessing it key by key.
   * When a key fails, takes the remaining key parts and tries to access the message
   * joining them into a single key.
   *
   * @param path - A dot separated key to access the message object.
   * @returns The message corresponding to the provided key, or empty string if it doesn't exist.
   */
  protected getMessageWithDotsInKey(path: string): string | null {
    // TO-DO Support function or array messages
    const message = path
      .split('.')
      .reduce<any>(
        (messages, key, index, pathParts) =>
          isObject(messages)
            ? messages[key] ?? messages[pathParts.slice(index).join('.')]
            : messages,
        this.currentMessages
      );
    return typeof message === 'string' ? message : null;
  }

  /**
   * Sets the new locale and updates the messages accordingly.
   *
   * @param newLocale - The new locale.
   *
   * @returns The new messages.
   */
  async setLocale(newLocale: Locale): Promise<void> {
    if (this.locale !== newLocale) {
      this.locale = newLocale;

      await this.changeMessages();
      this.vueI18n.global.locale = this.locale;
    }
  }

  /**
   * Sets the new device and updates the messages accordingly.
   *
   * @param newDevice - The new device.
   *
   * @returns The new messages.
   */
  async setDevice(newDevice: Device): Promise<void> {
    if (this.device !== newDevice) {
      this.device = newDevice;

      await this.changeMessages();
    }
  }

  /**
   * Updates the current messages based on the new locale and/or device.
   */
  protected async changeMessages(): Promise<void> {
    this.currentMessages = await this.getCurrentMessages();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.vueI18n.global.setLocaleMessage(this.locale, this.currentMessages);
  }

  /**
   * Retrieves the corresponding messages for the set locale and device.
   *
   * @remarks By default, it merges `base` messages with the specific `device` ones. If there are
   * no messages for the current locale, the fallback locale is used instead.
   *
   * @returns The messages for the current locale and device.
   */
  protected async getCurrentMessages(): Promise<LocaleMessageObject> {
    const rawMessages =
      this.locale in this.messages
        ? this.messages[this.locale]
        : this.messages[this.fallbackLocale];

    const messages = areLazyMessages(rawMessages) ? (await rawMessages()).default : rawMessages;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return deepMerge({}, messages.base, messages[this.device]);
  }
}

/**
 * Type-guard to check if the passed messages should be lazy-loaded.
 *
 * @param messages - The messages to check.
 *
 * @returns True if the messages are lazy or false otherwise.
 */
function areLazyMessages<SomeMessages>(
  messages: AnyMessages<SomeMessages>
): messages is LoadLazyMessagesByDevice<SomeMessages> {
  return typeof messages === 'function';
}
