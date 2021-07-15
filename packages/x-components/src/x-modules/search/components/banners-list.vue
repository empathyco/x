<template>
  <NoElement>
    <!--
      @slot Customized Banners List layout.
        @binding {Banner[]} items - Banners to render.
        @binding {GridItem[]} providedItems - A list containing the injected grid items, plus the
        retrieved banners, concatenated in the first positions.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, providedItems, animation }">
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
  import GridItemsInjectionMixin from './grid-items-injection.mixin';

  /**
   * It renders a list of banners from props or from {@link SearchState.banners} by default
   * using the {@link GridItemsInjectionMixin}.
   *
   * The component provides a default slot which wraps the whole component with the `items`
   * bound and the `injectedItems` which also contains the injected grid items from an ancestor.
   *
   * It also provides the slot result to customize the item, which is within the default slot, with
   * the result bound.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(searchXModule), GridItemsInjectionMixin]
  })
  export default class BannersList extends Vue {
    /**
     * The results to render.
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
