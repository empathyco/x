import { XModule } from '../x-modules.types';

/**
 * Search {@link XModule} alias.
 *
 * @public
 */
export type XControlsModule = XModule<any>;

/**
 * Search {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `x-controls` entry point.
 *
 * @public
 */
export const xControlsXModule: XControlsModule = {
  name: 'xcontrols',
  storeModule: {},
  storeEmitters: {},
  wiring: {}
};
