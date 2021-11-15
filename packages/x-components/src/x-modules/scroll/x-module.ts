import { XModule } from '../x-modules.types';
import { scrollEmitters } from './store/emitters';
import { scrollXStoreModule } from './store/module';
import { ScrollXStoreModule } from './store/types';
import { scrollWiring } from './wiring';

/**
 * Scroll {@link XModule} alias.
 *
 * @public
 */
export type ScrollXModule = XModule<ScrollXStoreModule>;

/**
 * Scroll {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `empathize` entry point.
 *
 * @public
 */
export const scrollXModule: ScrollXModule = {
  name: 'scroll',
  storeModule: scrollXStoreModule,
  storeEmitters: scrollEmitters,
  wiring: scrollWiring
};
