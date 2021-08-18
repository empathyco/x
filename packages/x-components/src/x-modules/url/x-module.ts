import { XModule } from '../x-modules.types';
import { urlEmitters, urlXStoreModule, UrlXStoreModule } from './store';
import { urlWiring } from './wiring';

/**
 * URL {@link XModule} alias.
 *
 * @public
 */
export type UrlXModule = XModule<UrlXStoreModule>;

/**
 * URL {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `url` entry point.
 *
 * @public
 */
export const urlXModule: UrlXModule = {
  name: 'url',
  storeModule: urlXStoreModule,
  storeEmitters: urlEmitters,
  wiring: urlWiring
};
