<template>
  <GlobalEvents v-if="!force" @resize="throttledStoreWindowWidth" target="window" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import GlobalEvents from 'vue-global-events';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { xComponentMixin, XEmit } from '../../../components';
  import { throttle } from '../../../utils/throttle';
  import { deviceXModule } from '../x-module';

  /** Alias just to improve code readiness. */
  type Device = string;
  /** Alias just to improve code readiness. */
  type MaxWidth = number;

  /**
   * This component helps detecting or setting a device, that can be used later to create
   * different layouts optimized for different devices. This detected device is available under
   * the {@link XComponentAliasAPI.device} property.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(deviceXModule)],
    components: {
      GlobalEvents
    }
  })
  export default class DeviceDetector extends Vue {
    /**
     * Record of the device name, that can be whatever you want `xs`, `mobile`, `big`... And
     * the max width in pixels for that device.
     *
     * @public
     */
    @Prop({ default: () => ({}) })
    public readonly breakpoints!: Record<Device, MaxWidth>;

    /**
     * Forces a device, ignoring the {@link DeviceDetector.breakpoints} prop.
     *
     * @public
     */
    @Prop()
    public readonly force?: Device;

    /**
     * Time in milliseconds to throttle the resize events used to detect the device.
     *
     * @public
     */
    @Prop({ default: 100 })
    public readonly throttleMs!: number;

    /**
     * The width in pixels of the window where the app is being rendered.
     *
     * @internal
     */
    protected windowWidthPx: number | null = null;

    /**
     * Throttled version of {@link DeviceDetector.storeWindowWidth} function.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    protected throttledStoreWindowWidth = this.storeWindowWidth;

    /**
     * List of each of the entries of the breakpoints sorted from the smallest to the biggest
     * max width.
     *
     * @returns A list of the breakpoints sorted by its max width in ascending order.
     *
     * @internal
     */
    protected get sortedBreakpoints(): [Device, MaxWidth][] {
      return Object.entries(this.breakpoints).sort(([, aWidth], [, bWidth]) => aWidth - bWidth);
    }

    /**
     * The device detected by this component, or the value provided in {@link DeviceDetector.force}
     * prop.
     *
     * @returns The detected device, or the value provided in {@link DeviceDetector.force}
     * prop.
     *
     * @internal
     */
    @XEmit('DeviceProvided')
    public get detectedDevice(): string | null {
      if (this.force) {
        return this.force;
      } else if (this.windowWidthPx === null) {
        return null;
      } else {
        return (
          this.sortedBreakpoints.find(([, width]) => this.windowWidthPx! <= width)?.[0] ?? null
        );
      }
    }

    /**
     * Stores the window width in {@link DeviceDetector.windowWidthPx}.
     *
     * @internal
     */
    protected storeWindowWidth(): void {
      this.windowWidthPx = window.innerWidth;
    }

    /**
     * Updates {@link DeviceDetector.throttledStoreWindowWidth} with the throttle time at
     * {@link DeviceDetector.throttleMs}.
     *
     * @param throttleMs - The new duration in milliseconds for the throttle.
     *
     * @internal
     */
    @Watch('throttleMs', { immediate: true })
    protected updateThrottledStoreWindowWidth(throttleMs: number): void {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.throttledStoreWindowWidth = throttle(this.storeWindowWidth, throttleMs);
    }

    /**
     * Initialises the store window width.
     *
     * @remarks This is done this way to ensure SSR compatibility.
     *
     * @internal
     */
    mounted(): void {
      this.storeWindowWidth();
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`DeviceProvided`](./../../api/x-components.devicexevents.md)

## See it in action

This component renders no element to the DOM, but serves as way to safely detect or set the device
name given an object containing all the possible breakpoints.

_Try resizing the browser window!_

```vue
<template>
  <div>
    <DeviceDetector :breakpoints="breakpoints" />
    {{ $x.device }}
  </div>
</template>

<script>
  import { DeviceDetector } from '@empathy/x-components/device';

  export default {
    name: 'DeviceDemo',
    components: {
      DeviceDetector
    },
    data() {
      return {
        breakpoints: {
          mobile: 600,
          tablet: 900,
          desktop: Number.POSITIVE_INFINITY
        }
      };
    }
  };
</script>
```

### Play with props

In this example, the `DeviceDetector` has been forced to always detect the `mobile` device. No
matter what the window width is.

_Try resizing the window to check that it never changes_

```vue
<template>
  <div>
    <DeviceDetector force="mobile" :breakpoints="breakpoints" />
    {{ $x.device }}
  </div>
</template>

<script>
  import { DeviceDetector } from '@empathy/x-components/device';

  export default {
    name: 'DeviceDemo',
    components: {
      DeviceDetector
    },
    data() {
      return {
        breakpoints: {
          mobile: 600,
          tablet: 900,
          desktop: Number.POSITIVE_INFINITY
        }
      };
    }
  };
</script>
```

### Play with events

In this example, the `DeviceDetector` will emit a `DeviceProvided` event, with the new device as the
payload. This device is stored in a data variable and then displayed.

_Try resizing the browser window!_

```vue
<template>
  <div>
    <DeviceDetector :breakpoints="breakpoints" @DeviceProvided="storeDevice" />
    {{ device }}
  </div>
</template>

<script>
  import { DeviceDetector } from '@empathy/x-components/device';

  export default {
    name: 'DeviceDemo',
    components: {
      DeviceDetector
    },
    data() {
      return {
        device: 'unknown',
        breakpoints: {
          mobile: 600,
          tablet: 900,
          desktop: Number.POSITIVE_INFINITY
        }
      };
    },
    methods: {
      storeDevice(device) {
        this.device = device;
      }
    }
  };
</script>
```
</docs>
