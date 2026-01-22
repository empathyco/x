<template>
  <GlobalEvents v-if="!force" target="window" @resize="throttledStoreWindowWidth" />
</template>

<script lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { GlobalEvents } from 'vue-global-events'
import { useXBus } from '../../../composables/use-x-bus'
import { throttle } from '../../../utils/throttle'
import { deviceXModule } from '../x-module'

/** Alias just to improve code readiness. */
type Device = string
/** Alias just to improve code readiness. */
type MaxWidth = number

/**
 * This component helps to detect or setting a device, that can be used later to create
 * different layouts optimized for different devices. This detected device is available under
 * the {@link XComponentAliasAPI.device} property.
 *
 * @public
 */
export default defineComponent({
  name: 'DeviceDetector',
  xModule: deviceXModule.name,
  components: { GlobalEvents },
  props: {
    /**
     * Record of the device name, that can be whatever you want `xs`, `mobile`, `big`... And
     * the max width in pixels for that device.
     *
     * @public
     */
    breakpoints: {
      type: Object as PropType<Record<Device, MaxWidth>>,
      default: () => ({}),
    },
    /**
     * Forces a device, ignoring the breakpoints prop.
     *
     * @public
     */
    force: String as PropType<Device>,

    /**
     * Time in milliseconds to throttle the resize events used to detect the device.
     *
     * @public
     */
    throttleMs: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    const xBus = useXBus()

    /**
     * The width in pixels of the window where the app is being rendered.
     *
     * @internal
     */
    const windowWidthPx: Ref<number | null> = ref(null)

    /**
     * Stores the window width in {@link DeviceDetector.windowWidthPx}.
     *
     * @internal
     */
    const storeWindowWidth = (): void => {
      windowWidthPx.value = window.innerWidth
    }

    /**
     * Throttled version of {@link DeviceDetector.storeWindowWidth} function.
     *
     * @internal
     */
    let throttledStoreWindowWidth = storeWindowWidth

    /**
     * List of each of the entries of the breakpoints sorted from the smallest to the biggest
     * max width.
     *
     * @returns A list of the breakpoints sorted by its max width in ascending order.
     *
     * @internal
     */
    const sortedBreakpoints = computed((): [Device, MaxWidth][] =>
      Object.entries(props.breakpoints).sort(([, aWidth], [, bWidth]) => aWidth - bWidth),
    )

    /**
     * The device detected by this component, or the value provided in {@link DeviceDetector.force}
     * prop.
     *
     * @returns The detected device, or the value provided in {@link DeviceDetector.force}
     * prop.
     *
     * @internal
     */
    const detectedDevice = computed((): string | null => {
      if (props.force) {
        return props.force
      } else if (windowWidthPx.value === null) {
        return null
      } else {
        return (
          sortedBreakpoints.value.find(([, width]) => windowWidthPx.value! <= width)?.[0] ?? null
        )
      }
    })

    watch(
      detectedDevice,
      device => {
        xBus.emit('DeviceProvided', device)
      },
      { immediate: true },
    )

    /**
     * Updates {@link DeviceDetector.throttledStoreWindowWidth} with the throttle time at
     * {@link DeviceDetector.throttleMs}.
     *
     * @param throttleMs - The new duration in milliseconds for the throttle.
     *
     * @internal
     */
    watch(
      () => props.throttleMs,
      throttleMs => {
        throttledStoreWindowWidth = throttle(storeWindowWidth, throttleMs)
      },
      { immediate: true },
    )

    /**
     * Initialises the store window width.
     *
     * @remarks This is done this way to ensure SSR compatibility.
     *
     * @internal
     */
    onMounted(() => {
      storeWindowWidth()
    })

    return {
      throttledStoreWindowWidth,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`DeviceProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

This component renders no element to the DOM, but serves as way to safely detect or set the device
name given an object containing all the possible breakpoints.

_Try resizing the browser window!_

```vue live
<template>
  <div>
    <DeviceDetector :breakpoints="breakpoints" />
    {{ x.device }}
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { DeviceDetector } from '@empathyco/x-components/device'
import { use$x } from '../../../composables/use-$x'

const x = use$x()
const breakpoints = reactive({
  mobile: 600,
  tablet: 900,
  desktop: Number.POSITIVE_INFINITY,
})
</script>
```

### Play with props

In this example, the `DeviceDetector` has been forced to always detect the `mobile` device. No
matter what the window width is.

_Try resizing the window to check that it never changes_

```vue live
<template>
  <div>
    <DeviceDetector force="mobile" :breakpoints="breakpoints" />
    {{ x.device }}
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { DeviceDetector } from '@empathyco/x-components/device'
import { use$x } from '../../../composables/use-$x'

const x = use$x()
const breakpoints = reactive({
  mobile: 600,
  tablet: 900,
  desktop: Number.POSITIVE_INFINITY,
})
</script>
```

### Play with events

In this example, the `DeviceDetector` will emit a `DeviceProvided` event, with the new device as the
payload. This device is stored in a ref and then displayed.

_Try resizing the browser window!_

```vue live
<template>
  <div>
    <DeviceDetector :breakpoints="breakpoints" @DeviceProvided="storeDevice" />
    {{ device }}
  </div>
</template>

<script setup>
import { DeviceDetector } from '@empathyco/x-components/device'
import { reactive, ref } from 'vue'
const device = ref('unknown')
const breakpoints = reactive({
  mobile: 600,
  tablet: 900,
  desktop: Number.POSITIVE_INFINITY,
})
function storeDevice(newDevice) {
  device.value = newDevice
}
</script>
```
</docs>
