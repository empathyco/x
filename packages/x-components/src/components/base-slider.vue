<template>
  <div class="x-base-slider">
    <div ref="slider" :class="['x-base-slider__nouislider'].concat(`${contentClass}`)" />
    <div class="x-base-slider__selected">
      <!--
        @slot Default selected range rendering. This slot will be used by default for rendering
        the selected range without an specific slot implementation.
            @binding {number[]} rangeSelected - The selected range values. Min position 0, Max position 1.
      -->
      <slot :range-selected="rangeSelected">
        <p class="x-base-slider__selected-min">
          <span>min value</span>
          <span>
            {{ rangeSelected[0] }}
          </span>
        </p>
        <p class="x-base-slider__selected-max">
          <span>max value</span>
          <span>
            {{ rangeSelected[1] }}
          </span>
        </p>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import type { API } from 'nouislider'
import type { PropType } from 'vue'
import { create } from 'nouislider'
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'

/**
 * This component implements a range slider and prints the selected values.
 * It receives a threshold prop to set the limits and uses v-model to get and set
 * the selected values.
 *
 * It makes use of the nouslider library @see https://refreshless.com/nouislider/
 * for the slider implementation.
 *
 */
export default defineComponent({
  name: 'BaseSlider',
  props: {
    /** The threshold prop sets the limits for the slider. */
    threshold: {
      type: Object as PropType<{ min: number; max: number }>,
      default: () => ({ min: 0, max: Number.MAX_SAFE_INTEGER }),
    },
    /** The modelValue prop sets the initial values for the slider. */
    modelValue: {
      type: Object as PropType<{ min: number; max: number }>,
      required: true,
    },
    /** Class to be able to customize slider styles. */
    contentClass: {
      type: String,
      default: '',
    },
  },
  /**
   * The component emits an event with the selected values whenever
   * the user changes the slider.
   */
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /** The nouislider instance. */
    let sliderInstance: API
    /** The nouislider element reference. */
    const slider = ref<HTMLElement>()

    /** The selected min value. */
    const minSelected = ref(props.modelValue?.min ?? props.threshold.min)
    /** The selected max value. */
    const maxSelected = ref(props.modelValue?.max ?? props.threshold.max)

    /** The selected range as an array. */
    const rangeSelected = computed(() => [minSelected.value, maxSelected.value])
    /** The range for the nouislider. */
    const slideRange = computed(() => ({ min: props.threshold.min, max: props.threshold.max }))

    onMounted(() => {
      // Create the slider instance
      sliderInstance = create(slider.value!, {
        start: rangeSelected.value,
        range: slideRange.value,
        step: 1,
        connect: true,
        margin: 1,
      })

      // Update the selected values when the slider update its values
      sliderInstance.on('update', ([min, max]) => {
        minSelected.value = Number(min)
        maxSelected.value = Number(max)
      })

      // Emits the selected values when the slider values change
      sliderInstance.on('change', () =>
        emit('update:modelValue', { min: minSelected.value, max: maxSelected.value }),
      )
    })

    onUnmounted(() => {
      // Waiting to finish the collapse animation before destroying it
      setTimeout(sliderInstance.destroy.bind(sliderInstance), 600)
    })

    /**
     * Watch the threshold prop to update the slider state and emit the selected values.
     */
    watch(
      () => props.threshold,
      ({ min, max }) => {
        sliderInstance.updateOptions({ range: slideRange.value, start: [min, max] }, false)
        emit('update:modelValue', { min, max })
      },
    )

    /**
     * Watch the modelValue prop to update the slider state.
     *
     * @remarks It only update the values if the values are corrects. It means,
     * values within the threshold limits and not equal to the current values.
     *
     * @returns Undefined.
     */
    watch([() => props.modelValue.min, () => props.modelValue.max], ([min, max]) => {
      // Check if the values are the same
      if (min === minSelected.value && max === maxSelected.value) {
        return
      }

      // Validate the values
      const minValidated = min < props.threshold.min ? props.threshold.min : min
      const maxValidated = max > props.threshold.max ? props.threshold.max : max

      // Update the nouislider values
      sliderInstance.set([minValidated, maxValidated])

      // Emit the selected values
      if (minValidated !== min || maxValidated !== max) {
        emit('update:modelValue', { min: minValidated, max: maxValidated })
      }
    })

    return {
      slider,
      rangeSelected,
    }
  },
})
</script>
<style lang="css">
@import 'nouislider/dist/nouislider.css';
/** Customize nouislider styles: https://refreshless.com/nouislider/examples/#section-styling */

.x-base-slider {
  gap: 16px;
}

.x-base-slider,
.x-base-slider__selected-min,
.x-base-slider__selected-max {
  display: flex;
  flex-flow: column nowrap;
}

.x-base-slider__selected {
  display: inline-flex;
}

.x-base-slider__selected-min,
.x-base-slider__selected-max {
  flex: 50%;
}

.x-base-slider__nouislider {
  margin: 16px 0;
  padding: 0 16px;
}

.x-base-slider__nouislider .noUi-handle {
  box-shadow: none;
}

.x-base-slider__nouislider .noUi-handle:before,
.x-base-slider__nouislider .noUi-handle:after {
  content: none;
}
</style>
<docs lang="mdx">
## Examples

This component renders a slider and the selected values. The component needs the threshold for the
slider, although is not required (If not passed, fallback is min: 0, max: Number.MAX_SAFE_INTEGER ),
which are passed using the `threshold` prop and the selected range, which is passed in using the
v-model.

### Default usage

It is required to send the value prop which holds the selected values.

```vue live
<template>
  <BaseSlider v-model="selectedRange" />
</template>

<script setup>
import { BaseSlider } from '@empathyco/x-components'
import { ref } from 'vue'
const selectedRange = ref({ min: 0, max: 1000 })
</script>
```

#### With threshold

```vue live
<template>
  <BaseSlider v-model="selectedRange" :threshold="threshold" />
</template>

<script setup>
import { BaseSlider } from '@empathyco/x-components'
import { ref } from 'vue'
const threshold = { min: 0, max: 1000 }
const selectedRange = ref({ ...threshold })
</script>
```

### Customized usage

#### Overriding the slots

It is possible to override the default slot to customize the layout for the selected values.

```vue live
<template>
  <BaseSlider v-model="selectedRange" :threshold="threshold" v-slot="{ rangeSelected }">
    <p class="x-base-slider__selected-min">
      <span>min value</span>
      <span>
        {{ rangeSelected[0] }}
      </span>
    </p>
    <p class="x-base-slider__selected-max">
      <span>max value</span>
      <span>
        {{ rangeSelected[1] }}
      </span>
    </p>
  </BaseSlider>
</template>

<script setup>
import { BaseSlider } from '@empathyco/x-components'
import { ref } from 'vue'
const threshold = { min: 0, max: 1000 }
const selectedRange = ref({ ...threshold })
</script>
```

It is also possible to add inputs to complement the slider and allow to change the selected values
manually.

```vue live
<template>
  <BaseSlider v-model="selectedRange" :threshold="threshold">
    <input
      @change="selectedRange.min = $event.target?.valueAsNumber || 0"
      class="x-input"
      name="min"
      type="number"
      :value="selectedRange.min"
      :aria-label="'min'"
    />

    <input
      @change="selectedRange.max = $event.target?.valueAsNumber || 1000000"
      style="display: block"
      class="x-input"
      name="max"
      type="number"
      :value="selectedRange.max"
      :aria-label="'max'"
    />
  </BaseSlider>
</template>

<script setup>
import { BaseSlider } from '@empathyco/x-components'
import { ref } from 'vue'
const threshold = { min: 0, max: 1000 }
const selectedRange = ref({ ...threshold })
</script>
```
</docs>
