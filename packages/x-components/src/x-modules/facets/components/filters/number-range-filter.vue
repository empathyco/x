<template>
  <RenderlessFilter
    v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
    :class="cssClasses"
    :clickEvents="_clickEvents"
    :filter="filter"
    class="x-number-range-filter"
  >
    <!--
      @slot The control element to render
      @binding {Filter} filter - The filter data
      @binding {() => void} clickFilter - Method that will invoke the needed actions after the user
      clicks the filter.
      @binding {Object} cssClasses - Object containing CSS classes to add to the button
      @binding {Boolean} isDisabled - True if the filter shouldn't be able to be selected by the
      user
    -->
    <slot
      v-bind="{
        filter,
        clickFilter,
        cssClasses,
        isDisabled
      }"
    >
      <button
        @click="clickFilter"
        :aria-checked="filter.selected.toString()"
        :class="cssClasses"
        :disabled="isDisabled"
        data-test="filter"
        role="checkbox"
      >
        <!--
          @slot The content to render inside the button
          @binding {Filter} filter - The filter data
        -->
        <slot :filter="filter" name="label">{{ filter.label }}</slot>
      </button>
    </slot>
  </RenderlessFilter>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NumberRangeFilter as NumberRangeFilterModel } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../../components';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';
  import RenderlessFilter from './renderless-filter.vue';

  /**
   * Renders a number range filter, emitting the needed events when clicked.
   *
   * @public
   */
  @Component({
    components: { RenderlessFilter },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class NumberRangeFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: NumberRangeFilterModel;

    /**
     * Additional events, with their payload, to emit when the filter is clicked.
     *
     * @public
     */
    @Prop()
    public clickEvents?: Partial<XEventsTypes>;

    /**
     * The {@link XEventsTypes | events} to emit.
     *
     * @returns The events to emit when clicked.
     * @internal
     */
    protected get _clickEvents(): Partial<XEventsTypes> {
      return {
        UserClickedANumberRangeFilter: this.filter,
        ...this.clickEvents
      };
    }

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-number-range-filter--is-selected': this.filter.selected
      };
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedAFilter`](x-components.xeventstypes.userclickedafilter.md): the event is emitted
  after the user clicks the button, using the `filter` prop as its payload.
- [`UserClickedANumberRangeFilter`](x-components.xeventstypes.userclickedanumberrangefilter.md): the
  event is emitted after the user clicks the button, using the `filter` prop as its payload.

## See it in action

This component renders a button which, on clicked, emits the `UserClickedAFilter` and the
`UserClickedANumberRangeFilter` events. By default, it renders the filter label as the button text.

The `filter` prop is required. The `clickEvents` prop is optional and allows configuring the events
to emit on click.

```vue
<template>
  <NumberRangeFilter :filter="filter" />
</template>

<script>
  import { NumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'NumberRangeFilterTest',
    components: {
      NumberRangeFilter
    },
    date() {
      return {
        filter: {
          id: `price:1-10`,
          modelName: 'NumberRangeFilter',
          label: `From 1 to 10`,
          facetId: 'price',
          range: {
            min: 1,
            max: 10
          },
          selected: false
        }
      };
    }
  };
</script>
```

### Playing with props

Configuring the events to emit when the filter is clicked.

```vue
<template>
  <NumberRangeFilter :clickEvents="{ UserClickedANumberRangeFilter: filter }" :filter="filter" />
</template>

<script>
  import { NumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'NumberRangeFilterTest',
    components: {
      NumberRangeFilter
    },
    date() {
      return {
        filter: {
          id: `price:1-10`,
          modelName: 'NumberRangeFilter',
          label: `From 1 to 10`,
          facetId: 'price',
          range: {
            min: 1,
            max: 10
          },
          selected: false
        }
      };
    }
  };
</script>
```

### Customizing its contents

```vue
<template>
  <NumberRangeFilter :filter="filter" v-slot="{ filter }">
    <img src="checkbox.png" />
    <span>{{ filter.label }}</span>
  </NumberRangeFilter>
</template>

<script>
  import { NumberRangeFilter } from '@empathyco/x-components/facets';

  export default {
    name: 'NumberRangeFilterTest',
    components: {
      NumberRangeFilter
    },
    date() {
      return {
        filter: {
          id: `price:1-10`,
          modelName: 'NumberRangeFilter',
          label: `From 1 to 10`,
          facetId: 'price',
          range: {
            min: 1,
            max: 10
          },
          selected: false
        }
      };
    }
  };
</script>
```
</docs>
