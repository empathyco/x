<template>
  <BaseSlider
    :model-value="range"
    :threshold="threshold"
    class="x-editable-number-range-filter"
    :class="{ 'x-editable-number-range-filter--error': hasError }"
    data-test="editable-number-range-filter"
    @update:model-value="newRange => (range = newRange)"
  >
    <!--
        @slot Empty slot used to customize the whole component.
          @binding {range} RangeValue - Component min and max values.
          @binding {threshold} RangeValue - Component min and max threshold values.
          @binding {setMin} function - Component min setter.
          @binding {setMax} function - Component max setter.
          @binding {emitUserModifiedFilter} function - It emits the
          `UserModifiedEditableNumberRangeFilter` X event.
          @binding {clearValues} function - It resets component min and max values to threshold values.
          @binding {hasError} boolean - Returns true when there is an error with component values.
          @binding {formatRangeValue} function - It formats a range value using the filter unit
          and the snippet config `uiLang`.
    -->
    <slot
      v-bind="{
        threshold,
        range,
        setMin,
        setMax,
        emitUserModifiedFilter,
        clearValues,
        hasError,
        formatRangeValue,
      }"
    >
      <!-- eslint-disable max-len -->
      <input
        name="min"
        type="number"
        inputmode="decimal"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--min xds:input"
        :value="range.min"
        data-test="range-min"
        :aria-label="rangeFilterMin"
        @change="setMin(($event?.target as HTMLInputElement)?.value)"
      />

      <input
        name="max"
        type="number"
        inputmode="decimal"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--max xds:input"
        :value="range.max"
        data-test="range-max"
        :aria-label="rangeFilterMax"
        @change="setMax(($event?.target as HTMLInputElement)?.value)"
      />

      <button
        v-if="!isInstant"
        class="x-editable-number-range-filter__apply xds:button"
        :disabled="hasError"
        data-test="range-apply"
        @click="emitUserModifiedFilter"
      >
        <!--
            @slot Slot used to customize the apply button content.
        -->
        <slot name="apply-content">✓</slot>
      </button>

      <button
        class="x-editable-number-range-filter__clear xds:button"
        data-test="range-clear"
        @click="clearValues"
      >
        <!--
            @slot Slot used to customize the clear button content.
        -->
        <slot name="clear-content">𐄂</slot>
      </button>
    </slot>
  </BaseSlider>
</template>

<script lang="ts">
import type { SliderFilter as SliderFilterModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { SnippetConfig } from '../../../../x-installer/api/api.types'
import { computed, defineComponent, inject, ref, watch } from 'vue'
import BaseSlider from '../../../../components/base-slider.vue'
import { use$x } from '../../../../composables'
import { facetsXModule } from '../../x-module'

/**
 * Renders an editable number range filter. It has two input fields to handle min and max values,
 * emitting the needed events when clicked.
 *
 * The range values shown in the inputs are formatted using `Intl.NumberFormat`, taking the `unit`
 * of the filter as the format style and the `uiLang` of the snippet config as the locale.
 *
 * It provides a default slot, with some utils bind, to customize the whole component; and two
 * named slots `apply-content` and `clear-content` to override each button content.
 *
 * If `instant` prop is true, the needed events are emitted immediately; else, apply button is
 * rendered to confirm to do it. False by default.
 *
 * If `clear` prop is true, clear button, which sets to null component min and max values, is
 * rendered. True by default.
 *
 * @public
 */
export default defineComponent({
  name: 'EditableNumberRangeFilter',
  xModule: facetsXModule.name,
  components: {
    BaseSlider,
  },
  props: {
    /**
     * The filter data to render and edit.
     *
     * @public
     */
    filter: {
      type: Object as PropType<SliderFilterModel>,
      required: true,
    },
    /**
     * If `instant` prop is true, the needed events are emitted immediately; else, apply button is
     * rendered to confirm to do it. False by default.
     *
     * @public
     */
    isInstant: Boolean,
  },
  setup(props) {
    const $x = use$x()

    /**
     * The snippet config, provided by the installer, which provides the uiLang and the currency
     * to format the range values.
     *
     * @internal
     */
    const snippetConfig = inject<SnippetConfig>('snippetConfig')

    const rangeFilterMin = 'minimum amount'
    const rangeFilterMax = 'maximum amount'

    /**
     * Returns {@link @empathyco/x-types#RangeValue} with component min and max
     * values.
     *
     * @returns Range value object with component values.
     *
     * @internal
     */
    const range = ref({ min: props.filter.range.min, max: props.filter.range.max })

    /**
     * It checks if component min and max values are valid.
     *
     * @returns True if there is any error in the component min and max values.
     *
     * @internal
     */
    const hasError = computed(
      () =>
        range.value.min !== null && range.value.max !== null && range.value.min > range.value.max,
    )

    const threshold = computed(() => ({
      min: props.filter.range.min ?? 0,
      max: props.filter.range.max ?? Number.MAX_SAFE_INTEGER,
    }))

    /**
     * It checks if component min and max values are different from the ones within the filter
     * provided as property.
     *
     * @returns True if they are different.
     *
     * @internal
     */
    const areValuesDifferent = computed(
      () =>
        range.value.min !== props.filter.range.min || range.value.max !== props.filter.range.max,
    )

    /**
     * It emits {@link FacetsXEvents.UserModifiedEditableNumberRangeFilter} event if there are no
     * errors and component `min` and `max` values are different than `filter.range` ones.
     *
     * @internal
     */
    const emitUserModifiedFilter = () => {
      console.log(props.filter.range, range.value)
      if (!hasError.value && areValuesDifferent.value) {
        $x.emit('UserModifiedSliderFilter', {
          ...props.filter,
          id: `price:${range.value.min}-${range.value.max}`,
          range: props.filter.range,
        })
      }
    }

    /**
     * The number format to use to format the range values. It uses the `unit` of the filter as
     * the format style and the `uiLang` of the snippet config as the locale.
     *
     * @returns An Intl.NumberFormat to format the range values.
     *
     * @internal
     */
    const numberFormatter = computed(
      () =>
        new Intl.NumberFormat(snippetConfig?.uiLang, {
          style: props.filter.unit,
          ...(props.filter.unit === 'currency' && {
            currency: snippetConfig?.currency ?? 'EUR',
          }),
        }),
    )

    /**
     * It formats a range value using the `unit` of the filter and the `uiLang` of the snippet
     * config.
     *
     * @param value - The range value to format.
     * @returns The formatted value, or an empty string if the value is null.
     *
     * @internal
     */
    const formatRangeValue = (value: number): string => numberFormatter.value.format(value)

    /**
     * `min` setter. It parses the raw value before setting it.
     *
     * @param rawValue - The raw value of the `min` input.
     *
     * @internal
     */
    const setMin = (rawValue: string) => {
      range.value.min = !rawValue || Number.isNaN(rawValue) ? threshold.value.min : Number(rawValue)
    }

    /**
     * `max` setter. It parses the raw value before setting it.
     *
     * @param rawValue - The raw value of the `max` input.
     *
     * @internal
     */
    const setMax = (rawValue: string) => {
      range.value.max = !rawValue || Number.isNaN(rawValue) ? threshold.value.max : Number(rawValue)
    }

    /**
     * It resets component `min` and `max` values, and it emits the change if component is
     * working in instant mode.
     *
     * @internal
     */
    const clearValues = () => {
      range.value.min = threshold.value.min
      range.value.max = threshold.value.max
    }

    /**
     * It resets the min/max range values to null if the
     * {@link FacetsXEvents.UserClickedClearAllFilters} event is fired.
     *
     * @public
     */
    $x.on('UserClickedClearAllFilters', false).subscribe(clearValues)

    /**
     * It watches the filter range values passed as property and updates component range values if
     * they change.
     *
     * @param newRange - New range value.
     *
     * @internal

    watch(
      () => props.filter.range,
      newRange => {
        range.value.min = newRange.min
        range.value.max = newRange.max
      },
      { deep: true },
    )

    watch(range, () => {
      if (props.isInstant) {
        emitUserModifiedFilter()
      }
    })*/

    return {
      rangeFilterMin,
      rangeFilterMax,
      range,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      threshold,
      formatRangeValue,
    }
  },
})
</script>

<style lang="css" scoped>
.x-editable-number-range-filter--error .x-editable-number-range-filter__input {
  border-color: red;
}

.x-editable-number-range-filter__input {
  width: 75px;
}
</style>
