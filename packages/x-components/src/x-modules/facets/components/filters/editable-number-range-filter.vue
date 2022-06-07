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
    <slot v-bind="{ min, max, setMin, setMax, emitUserModifiedFilter, clearValues, hasError }">
      <!-- eslint-disable max-len -->
      <input
        @change="setMin($event.target.valueAsNumber)"
        name="min"
        type="number"
        class="
          x-input
          x-editable-number-range-filter__input x-editable-number-range-filter__input--min
        "
        :value="min"
        data-test="range-min"
        :aria-label="rangeFilterMin"
      />

      <input
        @change="setMax($event.target.valueAsNumber)"
        name="max"
        type="number"
        class="
          x-input
          x-editable-number-range-filter__input x-editable-number-range-filter__input--max
        "
        :value="max"
        data-test="range-max"
        :aria-label="rangeFilterMax"
      />
      <!-- eslint-enable max-len -->

      <button
        v-if="!isInstant"
        @click="emitUserModifiedFilter"
        class="x-button x-editable-number-range-filter__apply"
        :disabled="hasError"
        data-test="range-apply"
      >
        <!--
            @slot Slot used to customize the apply button content.
        -->
        <slot name="apply-content">✓</slot>
      </button>

      <button
        v-if="renderClearButton"
        @click="clearValues"
        class="x-button x-editable-number-range-filter__clear"
        data-test="range-clear"
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
  import {
    EditableNumberRangeFilter as EditableNumberRangeFilterModel,
    RangeValue
  } from '@empathyco/x-types';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { VueCSSClasses } from '../../../../utils/types';
  import { facetsXModule } from '../../x-module';
  import { xComponentMixin } from '../../../../components/x-component.mixin';

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
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class EditableNumberRangeFilter extends Vue {
    /**
     * Component min value.
     *
     * @internal
     */
    protected min: RangeValue['min'] = null;
    /**
     * Component max value.
     *
     * @internal
     */
    protected max: RangeValue['max'] = null;

    /**
     * The filter data to render and edit.
     *
     * @public
     */
    @Prop({ required: true })
    public filter!: EditableNumberRangeFilterModel;

    /**
     * If `instant` prop is true, the needed events are emitted immediately; else, apply button is
     * rendered to confirm to do it. False by default.
     *
     * @public
     */
    @Prop({ default: false })
    public isInstant!: boolean;

    /**
     * If `clear` prop is true, clear button, which sets to null component min and max values, is
     * rendered. True by default.
     *
     * @public
     */
    @Prop({ default: true })
    public hasClearButton!: boolean;

    /**
     * It watches the filter range values passed as property and updates component range values if
     * they change.
     *
     * @param newRange - New range value.
     *
     * @internal
     */
    @Watch('filter.range', { immediate: true, deep: true })
    onFilterChanged(newRange: RangeValue): void {
      this.min = newRange.min;
      this.max = newRange.max;
    }

    /**
     * It watches range values in order to emit the event with the change if `isInstant`
     * property is true.
     *
     * @internal
     */
    @Watch('range', { deep: true })
    protected instantEmitUserModifiedFilter(): void {
      if (this.isInstant) {
        this.emitUserModifiedFilter();
      }
    }

    /**
     * Dynamic CSS classes.
     *
     * @returns Object which contains dynamic CSS classes.
     *
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return { 'x-editable-number-range-filter--error': this.hasError };
    }

    /**
     * Returns {@link @empathyco/x-types#RangeValue | RangeValue} with component min and max
     * values.
     *
     * @returns Range value object with component values.
     *
     * @internal
     */
    protected get range(): RangeValue {
      return { min: this.min, max: this.max };
    }

    /**
     * It returns true if the property `hasClearButton` is true and there are values to clear.
     *
     * @returns True if the clear button has to be rendered.
     *
     * @internal
     */
    protected get renderClearButton(): boolean {
      return this.hasClearButton && (this.min !== null || this.max !== null);
    }

    /**
     * It checks if component min and max values are valid.
     *
     * @returns True if there is any error in the component min and max values.
     *
     * @internal
     */
    protected get hasError(): boolean {
      return this.min !== null && this.max !== null && this.min > this.max;
    }

    /**
     * It checks if component min and max values are different than the ones within the filter
     * provided as property.
     *
     * @returns True if they are different.
     *
     * @internal
     */
    protected get areValuesDifferent(): boolean {
      return this.min !== this.filter.range.min || this.max !== this.filter.range.max;
    }

    /**
     * It returns the number if possible or null otherwise.
     *
     * @param value - Value.
     * @returns The element value as a number if possible or null.
     *
     * @internal
     */
    protected parseRangeValue(value: number): number | null {
      return isNaN(value) ? null : value;
    }

    /**
     * `min` setter.
     *
     * @param value - The component `min` value to be set.
     *
     * @internal
     */
    protected setMin(value: number): void {
      this.min = this.parseRangeValue(value);
    }

    /**
     * `max` setter.
     *
     * @param value - The component `max` value to be set.
     *
     * @internal
     */
    protected setMax(value: number): void {
      this.max = this.parseRangeValue(value);
    }

    /**
     * It sets component `min` and `max` values to null and it emits the change if component is
     * working in instant mode.
     *
     * @internal
     */
    protected clearValues(): void {
      this.min = null;
      this.max = null;
    }

    /**
     * It emits {@link FacetsXEvents.UserModifiedEditableNumberRangeFilter} event if there are no
     * errors and component `min` and `max` values are different than `filter.range` ones.
     *
     * @internal
     */
    protected emitUserModifiedFilter(): void {
      if (!this.hasError && this.areValuesDifferent) {
        this.$x.emit('UserModifiedEditableNumberRangeFilter', {
          ...this.filter,
          range: this.range
        });
      }
    }

    protected rangeFilterMin = 'minimum amount';
    protected rangeFilterMax = 'maximum amount';
  }
</script>

<style lang="scss">
  .x-editable-number-range-filter {
    &--error {
      .x-editable-number-range-filter__input {
        border-color: red;
      }
    }
  }
</style>

<docs lang="mdx">
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

<script>
  import { EditableNumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    components: {
      EditableNumberRangeFilter
    },
    data() {
      return {
        editableFilter: {
          facetId: 'age',
          id: 'age:primary',
          label: 'primary',
          modelName: 'EditableNumberRangeFilter',
          range: {
            min: null,
            max: null
          }
        }
      };
    }
  };
</script>
```

### Properties

```vue
<template>
  <EditableNumberRangeFilter :filter="editableFilter" :isInstant="true" :hasClearButton="false" />
</template>

<script>
  import { EditableNumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    components: {
      EditableNumberRangeFilter
    },
    data() {
      return {
        editableFilter: {
          facetId: 'age',
          id: 'age:primary',
          label: 'primary',
          modelName: 'EditableNumberRangeFilter',
          range: {
            min: null,
            max: null
          }
        }
      };
    }
  };
</script>
```

### Customizing content slots

```vue
<template>
  <EditableNumberRangeFilter :filter="editableFilter">
    <template name="apply-content">Apply</template>
    <template name="clear-content">Clear</template>
  </EditableNumberRangeFilter>
</template>

<script>
  import { EditableNumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    components: {
      EditableNumberRangeFilter
    },
    data() {
      return {
        editableFilter: {
          facetId: 'age',
          id: 'age:primary',
          label: 'primary',
          modelName: 'EditableNumberRangeFilter',
          range: {
            min: null,
            max: null
          }
        }
      };
    }
  };
</script>
```

### Customizing default slot

```vue
<template>
  <EditableNumberRangeFilter
    :filter="editableFilter"
    #default="{ min, max, setMin, setMax, emitUserModifiedFilter, clearValues, hasError }"
  >
    <button @click="emitUserModifiedFilter">✅ Apply!</button>
    <button @click="clearValues">🗑 Clear!</button>
    <input :value="min" @change="setMin($event.target.valueAsNumber)" />
    <input :value="max" @change="setMax($event.target.valueAsNumber)" />
    <div class="has-error" v-if="hasError">⚠️ Invalid range values</div>
  </EditableNumberRangeFilter>
</template>

<script>
  import { EditableNumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    components: {
      EditableNumberRangeFilter
    },
    data() {
      return {
        editableFilter: {
          facetId: 'age',
          id: 'age:primary',
          label: 'primary',
          modelName: 'EditableNumberRangeFilter',
          range: {
            min: null,
            max: null
          }
        }
      };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserModifiedEditableNumberRangeFilter`: this event is emitted instantly after typing the value or
  clicking the submit button. The event payload in both cases is an object containing the filter and
  the new value for the range.
</docs>
