<template>
  <BaseEventButton
    v-if="show"
    class="x-button x-clear-filters"
    data-test="clear-filters"
    :disabled="!hasSelectedFilters"
    :events="events"
    :class="cssClasses"
  >
    <slot :selectedFilters="selectedFilters">Clear Filters ({{ selectedFilters.length }})</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { VueCSSClasses } from '../../../utils';
  import { XEventsTypes } from '../../../wiring';
  import FacetsMixin from '../facets.mixin';
  import { facetsXModule } from '../x-module';

  /**
   * Renders a simple button, emitting the needed events when clicked.
   *
   * @remarks It extends {@link FacetsMixin}.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class ClearFilters extends FacetsMixin {
    /**
     * The events that will be emitted when the button clear filters is clicked.
     *
     * @returns The events to be emitted when the button clear filters is clicked.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return this.facetsIds
        ? {
            UserClickedClearAllFilters: this.facetsIds
          }
        : {
            UserClickedClearAllFilters: undefined
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
        'x-clear-filters--has-not-selected-filters': !this.hasSelectedFilters,
        'x-clear-filters--has-selected-filters': this.hasSelectedFilters
      };
    }
  }
</script>

<docs lang="mdx">
## Examples

This component renders a button, which on clicked emits the `UserClickedClearAllFilters` or
`UserClickedClearAllFilters` event.

### Basic usage

```vue
<ClearFilters />
```

### Customizing its contents

In this example, show the custom message in button.

```vue
<ClearFilters v-slot="{ selectedFilters }">
  Delete {{ selectedFilters.length }} selected
</ClearFilters>
```

In this example, show the custom message in button with always visible a true and list of facets
ids.

```vue
<ClearFilters v-slot="{ selectedFilters }" :alwaysVisible="true" :facetsIds="facetsIds">
  Delete {{ selectedFilters.length }} selected
</ClearFilters>
```

## Events

A list of events that the component will emit:

- `UserClickedClearAllFilters`: the event is emitted after the user clicks the button to clear a
  certain facets filter. The event payload is the id of the facets that are going to be cleared.
- `UserClickedClearAllFilters`: the event is emitted after the user clicks the button. The event
  payload is undefined.
</docs>
