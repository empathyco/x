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
      }"
    >
      <!-- eslint-disable max-len -->
      <input
        name="min"
        type="number"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--min xds:input"
        :class="inputsClass"
        :value="!isAnyRange ? range.min : null"
        data-test="range-min"
        :aria-label="rangeFilterMin"
        @change="setMin(($event?.target as HTMLInputElement)?.valueAsNumber)"
      />

      <input
        name="max"
        type="number"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--max xds:input"
        :class="inputsClass"
        :value="range.max"
        data-test="range-max"
        :aria-label="rangeFilterMax"
        @change="setMax(($event?.target as HTMLInputElement)?.valueAsNumber)"
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
import BaseSlider from '@x/components/base-slider.vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { use$x } from '../../../../composables'
import { facetsXModule } from '../../x-module'

/**
 * Renders an editable number range filter. It has two input fields to handle min and max values,
 * emitting the needed events when clicked.
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
     * It returns the number if possible or null otherwise.
     *
     * @param value - Value.
     * @returns The element value as a number if possible or null.
     *
     * @internal
     */
    const parseRangeValue = (value: number) => (Number.isNaN(value) ? null : value)

    /**
     * `min` setter.
     *
     * @param value - The component `min` value to be set.
     *
     * @internal
     */
    const setMin = (value: number) => {
      range.value.min = parseRangeValue(value)
    }

    /**
     * `max` setter.
     *
     * @param value - The component `max` value to be set.
     *
     * @internal
     */
    const setMax = (value: number) => {
      range.value.max = parseRangeValue(value)
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

```vue
<template>
  <EditableNumberRangeFilter
    :filter="editableFilter"
    #default="{ range, setMin, setMax, emitUserModifiedFilter, clearValues, hasError, isAnyRange }"
  >
    <button @click="emitUserModifiedFilter">✅ Apply!</button>
    <button @click="clearValues">🗑 Clear!</button>
    <input :value="!isAnyRange ? range.min : null" @change="setMin($event.target.valueAsNumber)" />
    <input :value="range.max" @change="setMax($event.target.valueAsNumber)" />
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
