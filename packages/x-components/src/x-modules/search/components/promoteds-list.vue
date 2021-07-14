<template>
  <NoElement>
    <!--
      @slot Customized Promoteds List layout.
          @binding {promoteds} promoteds - Promoteds to render.
          @binding {gridItems} gridItems - `Results` and `injectedGridItems`.
          @binding {animation} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ promoteds, gridItems, animation }">
      <component
        :is="animation"
        v-if="promoteds.length"
        tag="ul"
        class="x-list x-promoteds-list"
        data-test="promoteds-list"
      >
        <li
          v-for="promoted in gridItems"
          :key="promoted.id"
          class="x-promoteds-list__item"
          data-test="promoteds-list-item"
        >
          <!--
            @slot Customized Promoteds List promoted.
                @binding {promoted} promoted - Promoted data
          -->
          <slot :promoted="promoted" name="promoted">{{ promoted.title }}</slot>
        </li>
      </component>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Promoted } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { NoElement } from '../../../components/no-element';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { XInject, XProvide } from '../../../components/decorators/injection.decorators';
  import { GridItem } from '../../../utils/types';
  /**
   * It renders a list of promoteds from {@link SearchState.promoteds} by default.
   *
   * The component provides a default slot which wraps the whole component with the `promoteds`
   * bound and the `gridItems` which also contains the injected grid items from an ancestor.
   *
   * It also provides the slot promoted to customize the item, which is within the layout slot, with
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
  export default class PromotedsList extends Vue {
    /**
     * The results to render.
     *
     * @public
     */
    @State('search', 'promoteds')
    public promoteds!: Promoted[];

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
    @XInject('gridItems', [] as GridItem[])
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
      return [...this.promoteds, ...this.injectedGridItems];
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
    <PromotedsList>
      <template #default="{ promoteds, animation }">
        <BaseGrid :items="promoteds" :animation="animation">
          <template #Promoted="{ item }">
            <span>Promoted: {{ item.title }}</span>
          </template>
          <template #default="{ item }">
            <span>Default: {{ item }}</span>
          </template>
        </BaseGrid>
      </template>
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

### Overriding banner content

```vue
<template>
  <div>
    <SearchInput />
    <PromotedsList>
      <template #promoted="{ promoted }">
        <span class="promoted">
          {{ promoted.title }}
        </span>
      </template>
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

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <PromotedsList />
    </ResultsList>
  </div>
</template>

<script>
  import { SearchInput, ResultsList, PromotedsList } from '@empathyco/x-components/search';

  export default {
    name: 'BannersListDemo',
    components: {
      SearchInput,
      ResultsList,
      PromotedsList
    }
  };
</script>
```
</docs>
