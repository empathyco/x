<template>
  <NoElement>
    <!--
      @slot Customized Promoteds List layout.
        @binding {Promoted[]} items - Promoteds plus the injected search items to render.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, animation }">
      <SearchItemsList :animation="animation" :searchItems="items">
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="{ searchItem }">
          <slot :name="slotName" :searchItem="searchItem" />
        </template>
      </SearchItemsList>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Promoted } from '@empathyco/x-types-old';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import { SearchItem } from '../../../utils/types';
  import { SEARCH_ITEMS_KEY } from '../../../components/decorators/injection.consts';
  import SearchItemsInjectionMixin from './search-items-injection.mixin';
  import SearchItemsList from './search-items-list.vue';

  /**
   * It renders a {@link SearchItemsList} of promoteds from {@link SearchState.promoteds} by default
   * using the `SearchItemsInjectionMixin`.
   *
   * The component provides a default slot which wraps the whole component with the `promoteds`
   * plus the `searchInjectedItems` which also contains the injected search items from
   * the ancestor.
   *
   * It also provides the parent slots to customize the items.
   *
   * @public
   */
  @Component({
    components: {
      NoElement,
      SearchItemsList
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class PromotedsList extends SearchItemsInjectionMixin {
    /**
     * The promoteds to render from the state.
     *
     * @public
     */
    @State('search', 'promoteds')
    public stateItems!: Promoted[];

    /**
     * Animation component that will be used to animate the promoteds.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * The `stateItems` concatenated with the `injectedSearchItems` if there are.
     *
     * @remarks This computed defines the merging strategy of the `stateItems` and the
     * `injectedSearchItems`.
     *
     * @returns List of {@link SearchItem}.
     *
     * @internal
     */
    @XProvide(SEARCH_ITEMS_KEY)
    public get items(): SearchItem[] {
      return this.injectedSearchItems
        ? [...this.stateItems, ...this.injectedSearchItems]
        : this.stateItems;
    }
  }
</script>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

<!-- prettier-ignore-start -->
:::warning Backend service required
To use this component, the Search service must be implemented.
:::
<!-- prettier-ignore-end -->

Here you have a basic example of how the PromotedsList is rendered.

_Type any term in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput />
    <PromotedsList />
  </div>
</template>

<script>
  import { SearchInput, PromotedsList } from '@empathyco/x-components/search';

  export default {
    name: 'PromotedsListDemo',
    components: {
      SearchInput,
      PromotedsList
    }
  };
</script>
```

### Play with the animation

```vue
<template>
  <div>
    <SearchInput />
    <PromotedsList :animation="fadeAndSlide" />
  </div>
</template>

<script>
  import { SearchInput, PromotedsList } from '@empathyco/x-components/search';
  import { FadeAndSlide } from '@empathyco/x-components/animations';

  export default {
    name: 'PromotedsListDemo',
    components: {
      SearchInput,
      PromotedsList
    },
    data() {
      return {
        fadeAndSlide: FadeAndSlide
      };
    }
  };
</script>
```

### Overriding default content

```vue
<template>
  <div>
    <SearchInput />
    <PromotedsList #default="{ items, animation }">
      <BaseGrid :items="items" :animation="animation">
        <template #Promoted="{ item }">
          <span>Promoted: {{ item.title }}</span>
        </template>
        <template #default="{ item }">
          <span>Default: {{ item }}</span>
        </template>
      </BaseGrid>
    </PromotedsList>
  </div>
</template>

<script>
  import { SearchInput, PromotedsList } from '@empathyco/x-components/search';

  export default {
    name: 'PromotedsListDemo',
    components: {
      SearchInput,
      PromotedsList
    }
  };
</script>
```

### Overriding promoted content

```vue
<template>
  <div>
    <SearchInput />
    <PromotedsList #promoted="{ promoted }">
      <span class="promoted">
        {{ promoted.title }}
      </span>
    </PromotedsList>
  </div>
</template>

<script>
  import { SearchInput, PromotedsList } from '@empathyco/x-components/search';

  export default {
    name: 'PromotedsListDemo',
    components: {
      SearchInput,
      PromotedsList
    }
  };
</script>
```

### Data injection

Starting with the `ResultsList` component as root element, you can concat the list of search items
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `searchItems`
value.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <PromotedsList>
        <template #promoted="{ searchItem }">Promoted: {{ searchItem.id }}</template>
        <template #result="{ searchItem }">Result: {{ searchItem.id }}</template>
      </PromotedsList>
    </ResultsList>
  </div>
</template>

<script>
  import { SearchInput, ResultsList, PromotedsList } from '@empathyco/x-components/search';

  export default {
    name: 'PromotedsListDemo',
    components: {
      SearchInput,
      ResultsList,
      PromotedsList
    }
  };
</script>
```
</docs>
