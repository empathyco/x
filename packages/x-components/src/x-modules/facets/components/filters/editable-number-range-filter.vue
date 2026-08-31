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
          @binding {setMin} function - Component min setter.
          @binding {setMax} function - Component max setter.
          @binding {emitUserModifiedFilter} function - It emits the
          `UserModifiedEditableNumberRangeFilter` X event.
          @binding {clearValues} function - It sets component min and max values to null.
          @binding {hasError} boolean - Returns true when there is an error with component values.
          @binding {formatRangeValue} function - It formats a range value using the filter unit
          and the snippet config `uiLang`.
          @binding {parseRangeValue} function - It parses a range value from a raw input value.
    -->
    <slot
      v-bind="{
        range,
        setMin,
        setMax,
        emitUserModifiedFilter,
        clearValues,
        hasError,
        isAnyRange,
        formatRangeValue,
        parseRangeValue,
      }"
    >
      <!-- eslint-disable max-len -->
      <input
        name="min"
        type="text"
        inputmode="decimal"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--min xds:input"
        :class="inputsClass"
        :value="!isAnyRange ? formatRangeValue(range.min) : ''"
        data-test="range-min"
        :aria-label="rangeFilterMin"
        @change="setMin(parseRangeValue(($event?.target as HTMLInputElement)?.value ?? ''))"
      />

      <input
        name="max"
        type="text"
        inputmode="decimal"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--max xds:input"
        :class="inputsClass"
        :value="formatRangeValue(range.max)"
        data-test="range-max"
        :aria-label="rangeFilterMax"
        @change="setMax(parseRangeValue(($event?.target as HTMLInputElement)?.value ?? ''))"
      />

      <button
        v-if="!isInstant"
        class="x-editable-number-range-filter__apply xds:button"
        :class="buttonsClass"
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
        v-if="renderClearButton"
        class="x-editable-number-range-filter__clear xds:button"
        :class="buttonsClass"
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
import type {
  EditableNumberRangeFilter as EditableNumberRangeFilterModel,
  RangeValue,
} from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { SnippetConfig } from '../../../../x-installer/api/api.types'
import BaseSlider from '@x/components/base-slider.vue'
import { computed, defineComponent, inject, ref, watch } from 'vue'
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
      type: Object as PropType<EditableNumberRangeFilterModel>,
      required: true,
    },
    /**
     * If `instant` prop is true, the needed events are emitted immediately; else, apply button is
     * rendered to confirm to do it. False by default.
     *
     * @public
     */
    isInstant: Boolean,
    /**
     * If `clear` prop is true, clear button, which sets to null component min and max values, is
     * rendered. True by default.
     *
     * @public
     */
    hasClearButton: {
      type: Boolean,
      default: true,
    },
    /** Class inherited by content element. */
    inputsClass: String,
    /** Class inherited by content element. */
    buttonsClass: String,
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
     * Checks if the range of the filter allows any value, which happens when the min is
     * null or 0 and the max is null.
     *
     * @returns True if the range of the filter allows any value.
     *
     * @internal
     */
    const isAnyRange = computed(() => !range.value.min && range.value.max === null)

    /**
     * It returns true if the property `hasClearButton` is true and there are values to clear.
     *
     * @returns True if the clear button has to be rendered.
     *
     * @internal
     */
    const renderClearButton = computed(() => props.hasClearButton && !isAnyRange.value)

    /**
     * It emits {@link FacetsXEvents.UserModifiedEditableNumberRangeFilter} event if there are no
     * errors and component `min` and `max` values are different than `filter.range` ones.
     *
     * @internal
     */
    const emitUserModifiedFilter = () => {
      if (!hasError.value && areValuesDifferent.value) {
        $x.emit('UserModifiedEditableNumberRangeFilter', {
          ...props.filter,
          range: range.value,
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
    const numberFormatter = computed(() => {
      const options: Intl.NumberFormatOptions = { style: 'decimal' }
      if (props.filter.unit === 'currency') {
        options.style = 'currency'
        options.currency = snippetConfig?.currency ?? 'EUR'
      } else if (props.filter.unit === 'percent') {
        options.style = 'percent'
      }
      return new Intl.NumberFormat(snippetConfig?.uiLang, options)
    })

    /**
     * It formats a range value using the `unit` of the filter and the `uiLang` of the snippet
     * config.
     *
     * @param value - The range value to format.
     * @returns The formatted value, or an empty string if the value is null.
     *
     * @internal
     */
    const formatRangeValue = (value: number | null): string =>
      value === null ? '' : numberFormatter.value.format(value)

    /**
     * The decimal separator of the `uiLang` locale of the snippet config.
     *
     * @returns The decimal separator (e.g. `.` or `,`) of the locale.
     *
     * @internal
     */
    const decimalSeparator = computed(
      () =>
        new Intl.NumberFormat(snippetConfig?.uiLang)
          .formatToParts(0.5)
          .find(part => part.type === 'decimal')?.value,
    )

    /**
     * It parses the raw value of a range input, removing the formatting applied to it.
     *
     * @param rawValue - The raw input value.
     * @returns The parsed value as a number if possible or null otherwise.
     *
     * @internal
     */
    const parseRangeValue = (rawValue: string): number | null => {
      const cleaned = rawValue.replace(/[^\d,.\-]/g, '')
      if (cleaned === '' || cleaned === '-') {
        return null
      }

      const hasComma = cleaned.includes(',')
      const hasDot = cleaned.includes('.')
      let normalized: string
      if (hasComma && hasDot) {
        // The last separator used is the decimal one, the other one is the grouping one
        const decimal = cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.') ? ',' : '.'
        const grouping = decimal === ',' ? '.' : ','
        normalized = cleaned.split(grouping).join('').replace(',', '.')
      } else if (hasComma || hasDot) {
        const separator = hasComma ? ',' : '.'
        normalized =
          separator === decimalSeparator.value
            ? cleaned.replace(separator, '.')
            : cleaned.split(separator).join('')
      } else {
        normalized = cleaned
      }

      const parsed = Number.parseFloat(normalized)
      return Number.isNaN(parsed) ? null : parsed
    }

    /**
     * `min` setter.
     *
     * @param value - The component `min` value to be set.
     *
     * @internal
     */
    const setMin = (value: number | null) => {
      range.value.min = value
    }

    /**
     * `max` setter.
     *
     * @param value - The component `max` value to be set.
     *
     * @internal
     */
    const setMax = (value: number | null) => {
      range.value.max = value
    }

    /**
     * It sets component `min` and `max` values to null , and it emits the change if component is
     * working in instant mode.
     *
     * @internal
     */
    const clearValues = () => {
      range.value.min = null
      range.value.max = null
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
     */
    watch(
      () => props.filter.range,
      (newRange: RangeValue) => {
        range.value.min = newRange.min
        range.value.max = newRange.max
      },
      { immediate: true, deep: true },
    )

    /**
     * It watches range values in order to emit the event with the change if `isInstant`
     * property is true.
     *
     * @internal
     */
    watch(
      range,
      () => {
        if (props.isInstant) {
          emitUserModifiedFilter()
        }
      },
      { deep: true },
    )

    return {
      rangeFilterMin,
      rangeFilterMax,
      range,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      isAnyRange,
      renderClearButton,
      threshold,
      formatRangeValue,
      parseRangeValue,
    }
  },
})
</script>

<style lang="css" scoped>
.x-editable-number-range-filter--error .x-editable-number-range-filter__input {
  border-color: red;
}
</style>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserModifiedEditableNumberRangeFilter`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  this event is emitted instantly after typing the value or clicking the submit button. The event
  payload in both cases is an object containing the filter and the new value for the range.

## Example

Renders an editable number range filter. It has two input fields to handle min and max values,
emitting the needed events when clicked.

It provides a default slot, with some utils bind, to customize the whole component; and two named
slots `apply-content` and `clear-content` to override each button content.

If `instant` prop is true, the needed events are emitted immediately; else, apply button is rendered
to confirm to do it. False by default.

If `clear` prop is true, clear button, which sets to null component min and max values, is rendered.
True by default.

### Basic usage

```vue
<template>
  <EditableNumberRangeFilter :filter="editableFilter" />
</template>

<script setup>
import { EditableNumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const editableFilter = ref({
  facetId: 'age',
  id: 'age:primary',
  label: 'primary',
  modelName: 'EditableNumberRangeFilter',
  range: {
    min: null,
    max: null,
  },
})
</script>
```

### Properties

```vue
<template>
  <EditableNumberRangeFilter :filter="editableFilter" :isInstant="true" :hasClearButton="false" />
</template>

<script setup>
import { EditableNumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const editableFilter = ref({
  facetId: 'age',
  id: 'age:primary',
  label: 'primary',
  modelName: 'EditableNumberRangeFilter',
  range: {
    min: null,
    max: null,
  },
})
</script>
```

### Customizing content slots

```vue
<template>
  <EditableNumberRangeFilter :filter="editableFilter">
    <template #apply-content>Apply</template>
    <template #clear-content>Clear</template>
  </EditableNumberRangeFilter>
</template>

<script setup>
import { EditableNumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const editableFilter = ref({
  facetId: 'age',
  id: 'age:primary',
  label: 'primary',
  modelName: 'EditableNumberRangeFilter',
  range: {
    min: null,
    max: null,
  },
})
</script>
```

### Customizing default slot

The default slot exposes `formatRangeValue` and `parseRangeValue` so you can render the range
values formatted with the filter `unit` and the snippet config `uiLang`, and parse back the value
typed by the user.

```vue
<template>
  <EditableNumberRangeFilter
    :filter="editableFilter"
    #default="{
      range,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      isAnyRange,
      formatRangeValue,
      parseRangeValue,
    }"
  >
    <button @click="emitUserModifiedFilter">✅ Apply!</button>
    <button @click="clearValues">🗑 Clear!</button>
    <input
      type="text"
      :value="!isAnyRange ? formatRangeValue(range.min) : ''"
      @change="setMin(parseRangeValue($event.target.value))"
    />
    <input
      type="text"
      :value="formatRangeValue(range.max)"
      @change="setMax(parseRangeValue($event.target.value))"
    />
    <div class="has-error" v-if="hasError">⚠️ Invalid range values</div>
  </EditableNumberRangeFilter>
</template>

<script setup>
import { EditableNumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const editableFilter = ref({
  facetId: 'age',
  id: 'age:primary',
  label: 'primary',
  modelName: 'EditableNumberRangeFilter',
  range: {
    min: null,
    max: null,
  },
})
</script>
```

### Customizing the items with classes

The `buttonsClass` and `inputsClass` props can be used to add classes to the inputs and buttons of
the component.

```
<template>
  <EditableNumberRangeFilter
    :filter="editableFilter"
    :inputsClass="'my-inputs-class'"
    :buttonsClass="'my-buttons-class'"
  />
</template>

<script setup>
import { EditableNumberRangeFilter } from '@empathyco/x-components/facets'
import { ref } from 'vue'

const editableFilter = ref({
  facetId: 'age',
  id: 'age:primary',
  label: 'primary',
  modelName: 'EditableNumberRangeFilter',
  range: {
    min: null,
    max: null,
  },
})
</script>
```
</docs>
