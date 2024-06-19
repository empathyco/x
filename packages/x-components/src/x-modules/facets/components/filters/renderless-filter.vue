<script lang="ts">
  import { computed, defineComponent, h, PropType, ref } from 'vue';
  import { BooleanFilter } from '@empathyco/x-types';
  import { XEvent, XEventsTypes } from '../../../../wiring/events.types';
  import { facetsXModule } from '../../x-module';
  import { use$x } from '../../../../composables/use-$x';

  /**
   * Renders default slot content. It binds to the default slot a
   * {@link @empathyco/x-types#BooleanFilter}, the {@link XEvent}
   * that will be emitted when clicking the content, the css classes and if the content should be
   * deactivated.
   *
   * @remarks The default slot expects a root element, if it receives a list of elements, it will
   * renders the first element.
   *
   * @public
   */
  export default defineComponent({
    name: 'RenderlessFilter',
    module: facetsXModule.name,
    props: {
      /** The filter data to render. */
      filter: {
        type: Object as PropType<BooleanFilter>,
        required: true
      },
      /** Additional events with its payload to emit when the filter is clicked. */
      clickEvents: Object as PropType<Partial<XEventsTypes>>
    },
    setup: function (props, { slots }) {
      const $x = use$x();

      const rootElement = ref<HTMLElement | undefined>();

      /**
       * The events that will be emitted when the filter is clicked.
       *
       * @returns The events to be emitted when the filter is clicked.
       * @internal
       */
      const events = computed(() => {
        return {
          UserClickedAFilter: props.filter,
          ...props.clickEvents
        };
      });

      /**
       * Returns `true` when the filter should be disabled.
       *
       * @returns `true` if the filter should be disabled.
       * @internal
       */
      const isDisabled = computed(() => props.filter.totalResults === 0);

      /**
       * Dynamic CSS classes to apply to the component.
       *
       * @returns The dynamic CSS classes to apply to the component.
       * @internal
       */
      const cssClasses = computed(() => {
        return ['x-facet-filter', { 'x-selected': props.filter.selected }];
      });

      /**
       * The events to emit to the bus.
       *
       * @internal
       */
      const emitEvents = () => {
        Object.entries(events.value).forEach(([event, payload]) => {
          $x.emit(event as XEvent, payload, { target: rootElement.value as HTMLElement });
        });
      };

      return () => {
        return (
          slots.default?.({
            filter: props.filter,
            clickFilter: emitEvents,
            cssClasses: cssClasses.value,
            isDisabled: isDisabled.value
          })?.[0] ?? h()
        );
      };
    }
  });
</script>

<docs lang="mdx">
## Examples

Renders default slot content. It binds to the default slot a filter, the events that will be emitted
when clicking the content, the CSS classes and if the content should be deactivated.

### Basic usage

```vue
<RenderlessFilter :filter="filter" />
```

### Customizing its contents and adding new events

```vue
<template>
  <RenderlessFilter
    :filter="filter"
    :clickEvents="clickEvents"
    v-slot="{ filter, clickFilter, cssClasses, isDisabled }"
  >
    <button @click="clickFilter" :class="cssClasses" :disabled="isDisabled">
      {{ filter.label }}
    </button>
  </RenderlessFilter>
</template>

<script>
  import { RenderlessFilter } from '@empathyco/x-components';

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
