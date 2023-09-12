import { XModule } from '../x-modules.types';
import { xcontrolsStoreModule } from './store/module';
import { XControlsXStoreModule } from './store/types';

/**
 * Search {@link XModule} alias.
 *
 * @public
 */
export type XControlsModule = XModule<XControlsXStoreModule>;

/**
 * Search {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `x-controls` entry point.
 *
 * @public
 */
export const xControlsXModule: XControlsModule = {
  name: 'xcontrols',
  storeModule: xcontrolsStoreModule,
  storeEmitters: {},
  wiring: {}
};
