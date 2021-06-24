import { XStoreModule } from '../../../store';

/**
 * Device store state.
 *
 * @public
 */
export interface DeviceState {
  /**
   * The name of the device the app is being run on, or `null` if it hasn't been detected yet.
   *
   * @public
   */
  device: string | null;
}

/**
 * Device store getters.
 *
 * @public
 */
export interface DeviceGetters {}

/**
 * Device store mutations.
 *
 * @public
 */
export interface DeviceMutations {
  /**
   * Sets the {@link DeviceState.device} of the module.
   *
   * @param device - The new device state to set.
   */
  setDevice(device: string | null): void;
}

/**
 * Device store actions.
 *
 * @public
 */
export interface DeviceActions {}

/**
 * Device type safe store module.
 *
 * @public
 */
export type DeviceXStoreModule = XStoreModule<
  DeviceState,
  DeviceGetters,
  DeviceMutations,
  DeviceActions
>;
