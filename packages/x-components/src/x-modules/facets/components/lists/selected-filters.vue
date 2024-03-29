<template>
  <NoElement v-if="isVisible" class="x-selected-filters">
    <slot v-bind="{ selectedFilters }">{{ selectedFilters.length }}</slot>
  </NoElement>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import { NoElement } from '../../../../components';
  import { xComponentMixin } from '../../../../components/x-component.mixin';
  import FacetsMixin from '../facets.mixin';
  import { facetsXModule } from '../../x-module';

  /**
   * Provides a scoped slot with the selected filters from every facet, or from the facet which
   * facet id is passed as property.
   *
   * The default slot renders the length of the selected filters array.
   * The property "alwaysVisible" handles if the component is rendered if no filters are selected.
   *
   * @remarks It extends {@link FacetsMixin}.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)],
    components: {
      NoElement
    }
  })
  export default class SelectedFilters extends FacetsMixin {}
</script>

<docs lang="mdx">
## Examples

Provides a scoped slot with the selected filters from every facet, or from the facet which facet id
is passed as property.

The default slot renders the length of the selected filters array.

### Basic usage

```vue
<SelectedFilters />
```

### Always visible

If "alwaysVisible" is true, the component is rendered no matter if there are some filter selected.
If "alwaysVisible" is false (default), the component is rendered if there are some filter selected.

```vue
<SelectedFilters />
```

Output:

```html
<div class="x-selected-filters">1</div>
```

### Customizing its content

In this example, renders a custom message using the default scoped slot.

```vue
<SelectedFilters>
  <template #default="{ selectedFilters }">
    Selected filters: {{ selectedFilters.length }}
  </template>
</SelectedFilters>
```

Output:

```html
<div class="x-selected-filters">Selected filters: 1</div>
```

In this example, the selected filters are filtered by the facetsIds property.

```vue
<SelectedFilters :facetsIds="['brand_facet']" />
```

```vue
<SelectedFilters :facetsIds="['brand_facet', 'gender_facet']">
  <template #default="{ selectedFilters }">
    Selected filters: {{ selectedFilters.length }}
  </template>
</SelectedFilters>
```
</docs>
