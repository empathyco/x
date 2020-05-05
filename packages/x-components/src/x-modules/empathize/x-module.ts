import { XModule } from '../x-modules.types';
import { empathizeEmitters } from './store/emitters';
import { empathizeXStoreModule } from './store/module';
import { EmpathizeXStoreModule } from './store/types';
import { empathizeWiring } from './wiring';

/**
 * Empathize {@link XModule} alias.
 *
 * @public
 */
export type EmpathizeXModule = XModule<EmpathizeXStoreModule>;

/**
 * Empathize {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `empathize` entry point.
 *
 * @public
 */
export const empathizeXModule: EmpathizeXModule = {
  name: 'empathize',
  storeModule: empathizeXStoreModule,
  storeEmitters: empathizeEmitters,
  wiring: empathizeWiring
};
