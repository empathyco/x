<template>
  <NoElement>
    <!--
      @slot Customized Banners List layout.
        @binding {Banner[]} items - Banners plus the injected search items to render.
        @binding {SearchItem[]} banners - Banners list.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, banners: stateItems, animation }">
      <component
        :is="animation"
        v-if="items.length"
        tag="ul"
        class="x-list x-banners-list"
        data-test="banners-list"
      >
        <li
          v-for="banner in items"
          :key="banner.id"
          class="x-banners-list__item"
          data-test="banners-list-item"
        >
          <!--
            @slot Customized Banners List banner.
                @binding {Banner} banner - Banner data
          -->
          <slot :banner="banner" name="banner">{{ banner.title }}</slot>
        </li>
      </component>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Banner } from '@empathyco/x-types';
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

  /**
   * It renders a list of banners from {@link SearchState.banners} by default
   * using the `SearchItemsInjectionMixin`.
   *
   * The component provides a default slot which wraps the whole component with the `banners`
   * bound plus the `searchInjectedItems` which also contains the injected search items from
   * the ancestor.
   *
   * It also provides the slot `banner` to customize the item, which is within the default slot,
   * with the promoted bound.
   *
   * @public
   */
  @Component({
    components: {
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
  import { SearchInput, BannersList } from '@empathyco/x-components/search';

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
  import { SearchInput, BannersList } from '@empathyco/x-components/search';
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
  import { SearchInput, BannersList } from '@empathyco/x-components/search';

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
    <BannersList #banner="{ banner }">
      <span class="banner">
        {{ banner.title }}
      </span>
    </BannersList>
  </div>
</template>

<script>
  import { SearchInput, BannersList } from '@empathyco/x-components/search';

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

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <BannersList />
    </ResultsList>
  </div>
</template>

<script>
  import { SearchInput, ResultsList, BannersList } from '@empathyco/x-components/search';

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
