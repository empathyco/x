<script lang="ts">
  import Vue, { CreateElement, VNode } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { BooleanFilter } from '@empathy/search-types';
  import { xComponentMixin } from '../../../../components';
  import { VueCSSClasses } from '../../../../utils/types';
  import { XEvent, XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';

  /**
   * Renders default slot content. It binds to the default slot a
   * {@link @empathy/search-types#BooleanFilter | BooleanFilter}, the {@link XEvent | XEvents}
   * that will be emitted when clicking the content, the css classes and if the content should be
   * disabled.
   *
   * @remarks The default slot expects a root element, if it receives a list of elements, it will
   * renders the first element.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class RenderlessFilter extends Vue {
    /** The filter data to render. */
    @Prop({ required: true })
    public filter!: BooleanFilter;

    /** Additional events with its payload to emit when the filter is clicked. */
    @Prop()
    public clickEvents?: Partial<XEventsTypes>;

    /**
     * The events that will be emitted when the filter is clicked.
     *
     * @returns The events to be emitted when the filter is clicked.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserClickedAFilter: this.filter,
        ...this.clickEvents
      };
    }

    /**
     * The events to emit to the bus.
     *
     * @internal
     */
    protected emitEvents(): void {
      Object.entries(this.events).forEach(([event, payload]) => {
        this.$x.emit(event as XEvent, payload, { target: this.$el as HTMLElement });
      });
    }

    /**
     * Returns `true` when the filter should be disabled.
     *
     * @returns `true` if the filter should be disabled.
     * @internal
     */
    protected get isDisabled(): boolean {
      return this.filter.totalResults === 0;
    }

    /**
     * Dynamic CSS classes to apply to the component.
     *
     * @returns The dynamic CSS classes to apply to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return [
        'x-filter',
        {
          'x-filter--is-selected': this.filter.selected,
          'x-filter--is-disabled': this.isDisabled
        }
      ];
    }

    render(h: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          filter: this.filter,
          // eslint-disable-next-line @typescript-eslint/unbound-method
          clickFilter: this.emitEvents,
          cssClasses: this.cssClasses,
          isDisabled: this.isDisabled
        })?.[0] ?? h()
      );
    }
  }
</script>

<docs>
#Example

Renders default slot content. It binds to the default slot a filter, the events that will
be emitted when clicking the content, the css classes and if the content should be disabled.

## Basic usage

```vue
<RenderlessFilter :filter="filter"/>
```

## Customizing its contents and adding new events

```vue
<template>
  <RenderlessFilter
    :filter="filter"
    :clickEvents="clickEvents"
    v-slot="{ filter, clickFilter, cssClasses, isDisabled }">
      <button
        @click="clickFilter"
        :class="cssClasses"
        :disabled="isDisabled"
      >
        {{ filter.label }}
      </button>
  </RenderlessFilter>
</template>

<script>
  import { RenderlessFilter } from '@empathy/x-components';

  export default {
    components: {
      RenderlessFilter
    },
    props: ['filter'],
    computed: {
      clickEvents() {
        return { UserClickedAHierarchicalFilter: this.filter };
      }
    }
  };
</script>
```

</docs>
