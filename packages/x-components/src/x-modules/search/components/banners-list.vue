<template>
  <NoElement>
    <!--
      @slot Customized Banners List layout.
          @binding {banners} banners - Banners to render.
          @binding {gridItems} gridItems - `Results` and `injectedGridItems`.
          @binding {animation} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ banners, gridItems, animation }">
      <component
        :is="animation"
        v-if="banners.length"
        tag="ul"
        class="x-list x-banners-list"
        data-test="banners-list"
      >
        <li
          v-for="banner in banners"
          :key="banner.id"
          class="x-banners-list__item"
          data-test="banners-list-item"
        >
          <!--
            @slot Customized Banners List banner.
                @binding {banner} banner - Banner data
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
  import { XInject, XProvide } from '../../../components/decorators/injection.decorators';
  import { GridItem } from '../../../utils/types';
  /**
   * It renders a list of banners from {@link SearchState.banners} by default.
   *
   * The component provides a default slot which wraps the whole component with the `banners` bound
   * and the `gridItems` which also contains the injected grid items from an ancestor.
   *
   * It also provides the slot banner to customize the item, which is within the default slot, with
   * the result bound.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class BannersList extends Vue {
    /**
     * The results to render.
     *
     * @public
     */
    @State('search', 'banners')
    public banners!: Banner[];

    /**
     * Animation component that will be used to animate the promoteds.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;

    /**
     * It injects gridItems provided by an ancestor as injectedGridItems.
     *
     * @internal
     */
    @XInject('gridItems', <GridItem[]>[])
    public injectedGridItems!: GridItem[];

    /**
     * It provides `gridItems` which is the result of concatenating the `banners` and the
     * `injectedGridItems`.
     *
     * @returns Array of `banners` and `injectedGridItems`.
     *
     * @internal
     */
    @XProvide('gridItems')
    public get gridItems(): GridItem[] {
      return [...this.banners, ...this.injectedGridItems];
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits no events.

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
    <BannersList>
      <template #default="{ banners, animation }">
        <BaseGrid :items="banners" :animation="animation">
          <template #Banner="{ item }">
            <span>Banner: {{ item.name }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </template>
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
    <BannersList>
      <template #banner="{ banner }">
        <span class="banner">
          {{ banner.name }}
        </span>
      </template>
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
