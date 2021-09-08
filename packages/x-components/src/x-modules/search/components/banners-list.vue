<template>
  <NoElement>
    <!--
      @slot Customized BannersList layout.
        @binding {Banner[]} items - Banners plus the injected search items to render.
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
  import { Banner } from '@empathyco/x-types';
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
   * It renders a {@link ItemsList} list of banners from {@link SearchState.banners} by
   * default using the `ItemsInjectionMixin`.
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
      ItemsList,
      NoElement
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class BannersList extends ItemsListInjectionMixin {
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
      return this.injectedListItems
        ? [...this.stateItems, ...this.injectedListItems]
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
    <SearchInput />
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
    <SearchInput />
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
    <SearchInput />
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
    <SearchInput />
    <BannersList #banner="{ item }">
      <span class="banner">
        {{ item.title }}
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
using `BannersList`, `PromotedsList`, `BaseGrid` or any component that injects the `listItems`
value.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <BannersList>
        <template #banner="{ item }">Banner: {{ item.id }}</template>
        <template #result="{ item }">Result: {{ item.id }}</template>
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
