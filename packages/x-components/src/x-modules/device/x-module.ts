import { XModule } from '../x-modules.types';
import { deviceEmitters } from './store/emitters';
import { deviceXStoreModule } from './store/module';
import { DeviceXStoreModule } from './store/types';
import { deviceWiring } from './wiring';

/**
 * Device {@link XModule} alias.
 *
 * @public
 */
export type DeviceXModule = XModule<DeviceXStoreModule>;

/**
 * Device {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `device` entry point.
 *
 * @public
 */
export const deviceXModule: DeviceXModule = {
  name: 'device',
  storeModule: deviceXStoreModule,
  storeEmitters: deviceEmitters,
  wiring: deviceWiring
};
