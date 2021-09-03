<template>
  <NoElement>
    <!--
      @slot Customized BannersList layout.
        @binding {Banner[]} items - Banners plus the injected search items to render.
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
  import { Banner } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { SearchItemsInjectionMixin } from '../../../components/search-items-injection.mixin';
  import SearchItemsList from '../../../components/search-items-list.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { SearchItem } from '../../../utils/types';
  import { searchXModule } from '../x-module';

  /**
   * It renders a {@link SearchItemsList} list of banners from {@link SearchState.banners} by
   * default using the `SearchItemsInjectionMixin`.
   *
   * The component provides a default slot which wraps the whole component with the `banners`
   * plus the `searchInjectedItems` which also contains the injected search items from
   * the ancestor.
   *
   * It also provides the parent slots to customize the items.
   *
   * @public
   */
  @Component({
    components: {
      SearchItemsList,
      NoElement
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class BannersList extends SearchItemsInjectionMixin {
    /**
     * The banners to render from the state.
     *
     * @public
     */
    @State('search', 'banners')
    public stateItems!: Banner[];

    /**
     * Animation component that will be used to animate the banners.
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
    public override get items(): SearchItem[] {
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

Here you have a basic example of how the BannersList is rendered.

_Type any term in the input field to try it out!_

```vue
<template>
  <div>
    <SearchInput :instant="true" />
    <BannersList />
  </div>
</template>

<script>
  import { BannersList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'BannersListDemo',
    components: {
      SearchInput,
      BannersList
    }
  };
</script>
```

### Play with the animation

```vue
<template>
  <div>
    <SearchInput :instant="true" />
    <BannersList :animation="fadeAndSlide" />
  </div>
</template>

<script>
  import { BannersList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { FadeAndSlide } from '@empathyco/x-components/animations';

  export default {
    name: 'BannersListDemo',
    components: {
      SearchInput,
      BannersList
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
    <SearchInput :instant="true" />
    <BannersList #default="{ items, animation }">
      <BaseGrid :items="items" :animation="animation">
        <template #Banner="{ item }">
          <span>Banner: {{ item.title }}</span>
        </template>
        <template #default="{ item }">
          <span>Default: {{ item }}</span>
        </template>
      </BaseGrid>
    </BannersList>
  </div>
</template>

<script>
  import { BannersList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'BannersListDemo',
    components: {
      SearchInput,
      BannersList
    }
  };
</script>
```

### Overriding banner content

```vue
<template>
  <div>
    <SearchInput :instant="true" />
    <BannersList #banner="{ banner }">
      <span class="banner">
        {{ banner.title }}
      </span>
    </BannersList>
  </div>
</template>

<script>
  import { BannersList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'BannersListDemo',
    components: {
      SearchInput,
      BannersList
    }
  };
</script>
```

### Data injection

Starting with the `ResultsList` component as root element, you can concat the list of results and
banners in order to be injected by the `BaseGrid` (or components that extend it).

### Data injection

Starting with the `ResultsList` component as root element, you can concat the list of search items
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `searchItems`
value.

```vue
<template>
  <div>
    <SearchInput :instant="true" />
    <ResultsList>
      <BannersList>
        <template #banner="{ searchItem }">Banner: {{ searchItem.id }}</template>
        <template #result="{ searchItem }">Result: {{ searchItem.id }}</template>
      </BannersList>
    </ResultsList>
  </div>
</template>

<script>
  import { ResultsList, BannersList } from '@empathyco/x-components/search';
  import { SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'BannersListDemo',
    components: {
      SearchInput,
      ResultsList,
      BannersList
    }
  };
</script>
```
</docs>
