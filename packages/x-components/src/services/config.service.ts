import Vue from 'vue';
import { CurrencyOptions } from '../i18n/currency.types';
import { XBus } from '../plugins/x-bus.types';
import { DocumentDirection, XConfig } from '../plugins/x-plugin.types';

/**
 * Service to register a reactive {@link XConfig}.
 *
 * @param bus - XBus to emit events when a watcher triggers on a configuration property.
 * @param config - The {@link XConfig}.
 * @returns Vue instance with the {@link XConfig} reactive.
 * @public
 */
export function registerReactiveConfig(bus: XBus, config: XConfig): XConfig {
  return new Vue({
    data: () => config,
    watch: {
      consent: (newValue: boolean) => {
        bus.emit('ConfigConsentChanged', newValue);
      },
      currencyOptions: (newValue: CurrencyOptions) => {
        bus.emit('ConfigCurrencyChanged', newValue);
      },
      documentDirection: (newValue: DocumentDirection) => {
        bus.emit('ConfigDocumentDirectionChanged', newValue);
      }
    }
  });
}
