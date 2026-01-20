<template>
  <div
    class="x-editable-number-range-filter"
    :class="cssClasses"
    data-test="editable-number-range-filter"
  >
    <!--
        @slot Empty slot used to customize the whole component.
          @binding {min} number - Component min value.
          @binding {max} number - Component max value.
          @binding {setMin} function - Component min setter.
          @binding {setMax} function - Component max setter.
          @binding {emitUserModifiedFilter} function - It emits the
          `UserModifiedEditableNumberRangeFilter` X event.
          @binding {clearValues} function - It sets component min and max values to null.
          @binding {hasError} boolean - Returns true when there is an error with component values.
    -->
    <slot
      v-bind="{
        min,
        max,
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
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--min x-input"
        :class="inputsClass"
        :value="!isAnyRange ? min : null"
        data-test="range-min"
        :aria-label="rangeFilterMin"
        @change="setMin($event.target.valueAsNumber)"
      />

      <input
        name="max"
        type="number"
        class="x-editable-number-range-filter__input x-editable-number-range-filter__input--max x-input"
        :class="inputsClass"
        :value="max"
        data-test="range-max"
        :aria-label="rangeFilterMax"
        @change="setMax($event.target.valueAsNumber)"
      />
      <!-- eslint-enable max-len -->

      <button
        v-if="!isInstant"
        class="x-editable-number-range-filter__apply x-button"
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
        class="x-editable-number-range-filter__clear x-button"
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
  </div>
</template>

<script lang="ts">
import type {
  EditableNumberRangeFilter as EditableNumberRangeFilterModel,
  RangeValue,
} from '@empathyco/x-types'
import type { PropType, Ref } from 'vue'
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
     * Component min value.
     *
     * @internal
     */
    const min: Ref<RangeValue['min']> = ref(null)
    /**
     * Component max value.
     *
     * @internal
     */
    const max: Ref<RangeValue['max']> = ref(null)

    /**
     * Returns {@link @empathyco/x-types#RangeValue} with component min and max
     * values.
     *
     * @returns Range value object with component values.
     *
     * @internal
     */
    const range = computed((): RangeValue => {
      return { min: min.value, max: max.value }
    })

    /**
     * It checks if component min and max values are valid.
     *
     * @returns True if there is any error in the component min and max values.
     *
     * @internal
     */
    const hasError = computed(
      () => min.value !== null && max.value !== null && min.value > max.value,
    )

    /**
     * It checks if component min and max values are different from the ones within the filter
     * provided as property.
     *
     * @returns True if they are different.
     *
     * @internal
     */
    const areValuesDifferent = computed(
      () => min.value !== props.filter.range.min || max.value !== props.filter.range.max,
    )

    /**
     * Dynamic CSS classes.
     *
     * @returns Object which contains dynamic CSS classes.
     *
     * @internal
     */
    const cssClasses = computed(() => {
      return { 'x-editable-number-range-filter--error': hasError.value }
    })

    /**
     * Checks if the range of the filter allows any value, which happens when the min is
     * null or 0 and the max is null.
     *
     * @returns True if the range of the filter allows any value.
     *
     * @internal
     */
    const isAnyRange = computed(() => !min.value && max.value === null)

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
      min.value = parseRangeValue(value)
    }

    /**
     * `max` setter.
     *
     * @param value - The component `max` value to be set.
     *
     * @internal
     */
    const setMax = (value: number) => {
      max.value = parseRangeValue(value)
    }

    /**
     * It sets component `min` and `max` values to null , and it emits the change if component is
     * working in instant mode.
     *
     * @internal
     */
    const clearValues = () => {
      min.value = null
      max.value = null
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
        min.value = newRange.min
        max.value = newRange.max
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
      cssClasses,
      min,
      max,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      isAnyRange,
      renderClearButton,
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
    #default="{
      min,
      max,
      setMin,
      setMax,
      emitUserModifiedFilter,
      clearValues,
      hasError,
      isAnyRange,
    }"
  >
    <button @click="emitUserModifiedFilter">✅ Apply!</button>
    <button @click="clearValues">🗑 Clear!</button>
    <input :value="!isAnyRange ? min : null" @change="setMin($event.target.valueAsNumber)" />
    <input :value="max" @change="setMax($event.target.valueAsNumber)" />
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
