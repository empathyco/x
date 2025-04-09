import type { Ref } from 'vue'
import { reduce } from '@empathyco/x-utils'
import { useEventListener, useMemoize, useScreenOrientation, useWindowSize } from '@vueuse/core'
import { computed, effectScope, ref } from 'vue'
import { capitalize } from '../utils'

/**
 * The Return type of the composable returned by `createUseDevice`.
 *
 * @public
 */
export type UseDeviceReturn<Device extends string = string> = {
  orientation: Ref<'landscape' | 'portrait' | undefined>
  isTouchable: Ref<boolean>
  deviceName: Ref<string>
} & UseDeviceFlags<Device>

/**
 * The device flags type of the Return type of the composable returned by `createUseDevice`.
 *
 * @public
 */
export type UseDeviceFlags<Device extends string> = Record<
  `is${Capitalize<Device>}`,
  Ref<boolean>
> &
  Record<`is${Capitalize<Device>}OrGreater`, Ref<boolean>> &
  Record<`is${Capitalize<Device>}OrLess`, Ref<boolean>>

/**
 * Factory function that creates a composable for device detection using the devices parameter
 * to configure breakpoints.
 *
 * @param devices - An object containing the breakpoints, where the key is the name of the device
 * and the value is the screen width.
 * @returns A composable which provides multiple reactive flags and values for detecting the
 * current device. The flags names depends on the names passed in the `devices` parameter.
 * @remarks The `orientation` only works for orientation-sensor devices (mobile, tablet, etc). If
 * in a desktop, the height of the window is larger than the width, the orientation will be
 * `landscape`.
 *
 * @example
 * ´´´typescript
 * const useDevice = createUseDevice(\{ mobile: 0, tablet: 744, desktop: 1024 \});
 * const \{
 *   isMobile,
 *   isMobileOrLess,
 *   isMobileOrGreater,
 *   isTablet,
 *   isTabletOrLess,
 *   isTabletOrGreater,
 *   isDesktop,
 *   isDesktopOrLess,
 *   isDesktopOrGreater,
 *   deviceName,
 *   orientation,
 *   istTouchable
 * \} = useDevice();
 *
 * @public
 */
export function createUseDevice<Device extends string>(
  devices: Record<Device, number>,
): () => UseDeviceReturn<Device> {
  let devicesFlags: UseDeviceFlags<Device>
  let orientation: UseDeviceReturn['orientation']
  let isTouchable: UseDeviceReturn['isTouchable']
  let deviceName: UseDeviceReturn['deviceName']
  // The `effectScope` group all the changes in one to avoid multiple re-renderings.
  const scope = effectScope()
  scope.run(() => {
    devicesFlags = getDeviceFlags(devices)
    orientation = getOrientation()
    isTouchable = getIsTouchable()
    deviceName = getDeviceName(devices, devicesFlags)
  })
  return () => ({
    ...devicesFlags,
    orientation,
    isTouchable,
    deviceName,
  })
}

/**
 * A function that returns reactive flags to detect the current device based on provided
 * breakpoints.
 *
 * @param devices - An object containing the breakpoints, where the key is the name of the device
 * and the value is the screen width.
 * @returns A object containing the multiple reactive flags.
 *
 * @internal
 */
function getDeviceFlags<Device extends string>(
  devices: Record<Device, number>,
): UseDeviceFlags<Device> {
  const { width: windowSize } = useWindowSize()
  return reduce(
    devices,
    (accumulator, device, deviceWidth) => {
      const isDevice = computed(() => isCurrentDevice(device, devices, windowSize.value))
      accumulator[`is${capitalize(device)}`] = isDevice
      accumulator[`is${capitalize(device)}OrLess`] = computed(
        () => deviceWidth >= windowSize.value || isDevice.value,
      )
      accumulator[`is${capitalize(device)}OrGreater`] = computed(
        () => deviceWidth <= windowSize.value,
      )
      return accumulator
    },
    {} as Record<string, Ref<boolean>>,
  )
}

/**
 * To get the devices sorted by size and not run this calculation on every check.
 */
const getSortedByWidthDevices = useMemoize((devices: Record<string, number>) =>
  Object.entries(devices).sort(([, aWidth], [, bWidth]) => bWidth - aWidth),
)

/**
 * Checks if the current device satisfies the criteria of being a valid device.
 *
 * @param device - The name of the current device.
 * @param devices - An object containing device names and their
 * respective widths.
 * @param windowSize - The width of the window.
 * @returns A boolean value indicating whether the current device satisfies the
 * criteria of being a valid device.
 *
 * @internal
 */
function isCurrentDevice(
  device: string,
  devices: Record<string, number>,
  windowSize: number,
): boolean {
  const deviceWidth = devices[device]
  return (
    deviceWidth <= windowSize &&
    !getSortedByWidthDevices(devices).some(
      ([, otherDeviceWidth]) => otherDeviceWidth <= windowSize && otherDeviceWidth > deviceWidth,
    )
  )
}

/**
 * A function that returns the current device orientation as a reactive value.
 *
 * @returns A reactive value indicating the current device
 * orientation.
 *
 * @internal
 */
function getOrientation(): UseDeviceReturn['orientation'] {
  const { orientation } = useScreenOrientation()
  return computed(() =>
    orientation.value?.includes('landscape')
      ? 'landscape'
      : orientation.value?.includes('portrait')
        ? 'portrait'
        : undefined,
  )
}

/**
 * A function that returns a reactive boolean indicating whether the current device is
 * touch-enabled.
 *
 * @returns A reactive boolean indicating whether the current device is touch-enabled.
 *
 * @internal
 */
function getIsTouchable(): Ref<boolean> {
  const isTouchableRef = ref(detectTouchable())
  if (window) {
    useEventListener(window, 'resize', () => (isTouchableRef.value = detectTouchable()), {
      passive: true,
    })
  }
  return isTouchableRef
}

/**
 * A function that returns a reactive string indicating the name of the currently detected device
 * based on the provided devices and device flags.
 *
 * @param  devices - An object containing the breakpoints, where the key is the name of the device
 * and the value is the screen width.
 * @param devicesFlags - An object containing multiple reactive flags and values for detecting
 * the current device.
 * @returns A reactive string indicating the name of the currently detected device.
 *
 * @internal
 */
function getDeviceName(
  devices: Record<string, number>,
  devicesFlags: UseDeviceFlags<string>,
): Ref<string> {
  return computed(
    () => Object.keys(devices).find(device => devicesFlags[`is${capitalize(device)}`]?.value) ?? '',
  )
}

/**
 * A utility function that detects whether the current device is touch-enabled.
 *
 * @returns A boolean indicating whether the current device is touch-enabled.
 *
 * @internal
 */
function detectTouchable(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
