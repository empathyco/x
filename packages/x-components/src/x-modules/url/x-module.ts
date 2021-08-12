import { XModule } from '../x-modules.types';
import { urlEmitters, urlXStoreModule, URLXStoreModule } from './store';
import { urlWiring } from './wiring';

/**
 * URL {@link XModule} alias.
 *
 * @public
 */
export type URLXModule = XModule<URLXStoreModule>;

/**
 * URL {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `empathize` entry point.
 *
 * @public
 */
export const urlXModule: URLXModule = {
  name: 'url',
  storeModule: urlXStoreModule,
  storeEmitters: urlEmitters,
  wiring: urlWiring
};
