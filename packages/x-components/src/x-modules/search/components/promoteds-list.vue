<template>
  <NoElement>
    <!--
      @slot Customized Promoteds List layout.
        @binding {Promoted[]} items - Promoteds plus the injected list items to render.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, animation }">
      <ItemsList :animation="animation" :items="items">
        <template v-for="(_, slotName) in $scopedSlots" v-slot:[slotName]="{ item }">
          <slot :name="slotName" :item="item" />
        </template>
      </ItemsList>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Promoted } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { ItemsListInjectionMixin } from '../../../components/items-list-injection.mixin';
  import ItemsList from '../../../components/items-list.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { ListItem } from '../../../utils/types';
  import { searchXModule } from '../x-module';

  /**
   * It renders a {@link ItemsList} of promoteds from {@link SearchState.promoteds} by default
   * using the `ItemsInjectionMixin`.
   *
   * The component provides a default slot which wraps the whole component with the `promoteds`
   * plus the `searchInjectedItems` which also contains the injected list items from
   * the ancestor.
   *
   * It also provides the parent slots to customize the items.
   *
   * @public
   */
  @Component({
    components: {
      NoElement,
      ItemsList
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class PromotedsList extends ItemsListInjectionMixin {
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
     * The `stateItems` concatenated with the `injectedListItems` if there are.
     *
     * @remarks This computed defines the merging strategy of the `stateItems` and the
     * `injectedListItems`.
     *
     * @returns List of {@link ListItem}.
     *
     * @internal
     */
    public override get items(): ListItem[] {
      if (!this.injectedListItems?.length) {
        return this.stateItems;
      }
      const items = [...this.injectedListItems];
      for (const item of this.stateItems) {
        const position = item.position ?? 1;
        let index = position - 1;
        while (items.at(index)?.modelName === 'Promoted') {
          index++;
        }
        const isIndexInLoadedPages = index <= items.length;
        const areAllPagesLoaded = this.$x.results.length === this.$x.totalResults;
        if (!isIndexInLoadedPages && !areAllPagesLoaded) {
          break;
        }
        items.splice(index, 0, item);
      }
      return items;
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
  import { PromotedsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

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
  import { PromotedsList } from '@empathyco/x-components/search';
  import { FadeAndSlide } from '@empathyco/x-components/animations';
  import { SearchInput } from '@empathyco/x-components/search-box';

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
        <template #promoted="{ item }">
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
  import { PromotedsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { BaseGrid } from '@empathyco/x-components';

  export default {
    name: 'PromotedsListDemo',
    components: {
      SearchInput,
      PromotedsList,
      BaseGrid
    }
  };
</script>
```

### Overriding promoted content

```vue
<template>
  <div>
    <SearchInput />
    <PromotedsList #promoted="{ item }">
      <span class="promoted">
        {{ item.title }}
      </span>
    </PromotedsList>
  </div>
</template>

<script>
  import { PromotedsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

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

Starting with the `ResultsList` component as root element, you can concat the list of list items
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `listItems`
value.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <PromotedsList>
        <template #promoted="{ item }">Promoted: {{ item.id }}</template>
        <template #result="{ item }">Result: {{ item.id }}</template>
      </PromotedsList>
    </ResultsList>
  </div>
</template>

<script>
  import { ResultsList, PromotedsList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

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
