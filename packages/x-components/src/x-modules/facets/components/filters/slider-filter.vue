<template>
  <BaseSlider
    v-model="selectedRange"
    :threshold="threshold"
    class="x-slider-filter"
    :class="{ 'x-slider-filter--error': hasError }"
  >
    <!--
      @slot Slot used to customize the whole component.

      @binding {selectedRange} RangeValue - Current selected minimum and maximum values.
      @binding {threshold} RangeValue - Minimum and maximum boundaries of the slider.
      @binding {setMin} function - Sets the selected minimum value.
      @binding {setMax} function - Sets the selected maximum value.
      @binding {emitUserModifiedFilter} function - Emits the `UserModifiedSliderFilter` event.
      @binding {clearValues} function - Resets the selected range to the slider boundaries.
      @binding {hasError} boolean - Whether the selected range is invalid.
    -->
    <slot
      v-bind="{
        threshold,
        selectedRange,
        setMin,
        setMax,
        emitUserModifiedFilter,
        clearValues,
        hasError,
      }"
    >
      <div>
        <input
          name="min"
          type="number"
          inputmode="decimal"
          class="x-slider-filter__input x-slider-filter__input--min xds:input"
          :value="selectedRange.min"
          :min="threshold.min"
          :max="threshold.max"
          data-test="slider-filter-input-min"
          :aria-label="minAriaLabel"
          @change="setMin(($event.target as HTMLInputElement).value)"
        />

        <input
          name="max"
          type="number"
          inputmode="decimal"
          class="x-slider-filter__input x-slider-filter__input--max xds:input"
          :value="selectedRange.max"
          :min="threshold.min"
          :max="threshold.max"
          data-test="slider-filter-input-max"
          :aria-label="maxAriaLabel"
          @change="setMax(($event.target as HTMLInputElement).value)"
        />

        <button
          v-if="!isInstant"
          class="x-slider-filter__apply xds:button"
          :disabled="hasError"
          data-test="slider-filter-apply"
          @click="emitUserModifiedFilter"
        >
          ✓
        </button>

        <button
          class="x-slider-filter__clear xds:button"
          data-test="slider-filter-clear"
          @click="clearValues"
        >
          𐄂
        </button>
      </div>
    </slot>
  </BaseSlider>
</template>

<script lang="ts">
import type { SliderFilter as SliderFilterModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import BaseSlider from '../../../../components/base-slider.vue'
import { use$x } from '../../../../composables'
import { facetsXModule } from '../../x-module'

/**
 * Renders a slider filter with editable minimum and maximum values.
 *
 * Users can select a range using the slider or by entering the minimum and
 * maximum values directly.
 *
 * In instant mode, valid changes are emitted automatically. Otherwise, the
 * apply button is rendered and changes are emitted when it is clicked.
 *
 * The clear action resets the selected range to the slider boundaries.
 *
 * The default slot exposes the selected range, slider boundaries, validation
 * state, and methods to update, apply, or clear the selected values.
 *
 * @public
 */
export default defineComponent({
  name: 'SliderFilter',
  xModule: facetsXModule.name,
  components: {
    BaseSlider,
  },
  props: {
    /**
     * The slider filter data to render and edit.
     *
     * @public
     */
    filter: {
      type: Object as PropType<SliderFilterModel>,
      required: true,
    },
    /**
     * Whether changes should be emitted immediately.
     *
     * When false, the apply button is rendered and changes are emitted when
     * the user clicks it.
     *
     * @default false
     * @public
     */
    isInstant: Boolean,
    /**
     * Accessible label for the minimum value input.
     *
     * @public
     */
    minAriaLabel: {
      type: String,
      default: 'minimum amount',
    },
    /**
     * Accessible label for the maximum value input.
     *
     * @public
     */
    maxAriaLabel: {
      type: String,
      default: 'maximum amount',
    },
  },

  setup(props) {
    const $x = use$x()

    /**
     * Current selected minimum and maximum values.
     *
     * Values that are not selected are initialized to the corresponding
     * slider boundaries.
     *
     * @internal
     */
    const selectedRange = ref({
      min: props.filter.selectedRange.min ?? props.filter.range.min,
      max: props.filter.selectedRange.max ?? props.filter.range.max,
    })

    /**
     * Minimum and maximum boundaries of the slider.
     *
     * @internal
     */
    const threshold = computed(() => ({
      min: props.filter.range.min,
      max: props.filter.range.max,
    }))

    /**
     * Whether the selected range is invalid because its minimum is greater
     * than its maximum.
     *
     * @internal
     */
    const hasError = computed(
      () =>
        selectedRange.value.min !== null &&
        selectedRange.value.max !== null &&
        selectedRange.value.min > selectedRange.value.max,
    )

    /**
     * Whether the selected range differs from the range currently applied
     * to the filter.
     *
     * @internal
     */
    const areValuesDifferent = computed(
      () =>
        selectedRange.value.min !== (props.filter.selectedRange.min ?? props.filter.range.min) ||
        selectedRange.value.max !== (props.filter.selectedRange.max ?? props.filter.range.max),
    )

    /**
     * Emits the `UserModifiedSliderFilter` event when the selected range is
     * valid and differs from the currently applied filter range.
     *
     * @internal
     */
    const emitUserModifiedFilter = () => {
      if (hasError.value || !areValuesDifferent.value) {
        return
      }

      $x.emit('UserModifiedSliderFilter', {
        ...props.filter,
        selectedRange: selectedRange.value,
      })
    }

    /**
     * Sets one of the selected range values from a raw input value.
     *
     * Empty or invalid values are reset to the corresponding slider boundary.
     *
     * @param key - Range boundary to update.
     * @param rawValue - Raw input value.
     *
     * @internal
     */
    const setRangeValue = (key: 'min' | 'max', rawValue: string) => {
      const value = Number(rawValue)

      selectedRange.value[key] =
        rawValue === '' || Number.isNaN(value) ? threshold.value[key] : value
    }

    /**
     * Sets the selected minimum value.
     *
     * @param rawValue - Raw input value.
     *
     * @internal
     */
    const setMin = (rawValue: string) => {
      setRangeValue('min', rawValue)
    }

    /**
     * Sets the selected maximum value.
     *
     * @param rawValue - Raw input value.
     *
     * @internal
     */
    const setMax = (rawValue: string) => {
      setRangeValue('max', rawValue)
    }

    /**
     * Resets the selected range to the slider boundaries.
     *
     * @internal
     */
    const clearValues = () => {
      selectedRange.value = {
        min: threshold.value.min,
        max: threshold.value.max,
      }
    }

    /**
     * Resets the selected range when all filters, or the filters of this facet, are cleared.
     *
     * @public
     */
    $x.on('UserClickedClearAllFilters', false).subscribe(facetsIds => {
      if (!facetsIds || facetsIds.includes(props.filter.facetId)) {
        clearValues()
      }
    })

    /**
     * Updates the local selected range when the filter selected range changes,
     * but only if the values actually differ from the current local ones.
     *
     * @internal
     */
    watch(
      () => props.filter.selectedRange,
      newRange => {
        const min = newRange.min ?? props.filter.range.min
        const max = newRange.max ?? props.filter.range.max

        if (min !== selectedRange.value.min || max !== selectedRange.value.max) {
          selectedRange.value = { min, max }
        }
      },
    )

    /**
     * Emits the filter modification automatically when instant mode is enabled
     * and the selected range values (min or max) change.
     *
     * Replacing the selected range with an object holding the same values does
     * not trigger the emit.
     *
     * @internal
     */
    watch([() => selectedRange.value.min, () => selectedRange.value.max], () => {
      if (props.isInstant) {
        emitUserModifiedFilter()
      }
    })

    return {
      selectedRange,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      threshold,
    }
  },
})
</script>

<style lang="css" scoped>
.x-slider-filter--error .x-slider-filter__input {
  border-color: red;
}
</style>
