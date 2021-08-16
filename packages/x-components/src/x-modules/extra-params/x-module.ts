import { XModule } from '../x-modules.types';
import { extraParamsEmitters, extraParamsXStoreModule, ExtraParamsXStoreModule } from './store';
import { extraParamsWiring } from './wiring';

/**
 * Extra params {@link XModule} alias.
 *
 * @public
 */
export type ExtraParamsXModule = XModule<ExtraParamsXStoreModule>;

/**
 * Extra params {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `extra params` entry point.
 *
 * @public
 */
export const extraParamsXModule: ExtraParamsXModule = {
  name: 'extraParams',
  storeModule: extraParamsXStoreModule,
  storeEmitters: extraParamsEmitters,
  wiring: extraParamsWiring
};
