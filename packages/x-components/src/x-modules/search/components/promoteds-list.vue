<template>
  <NoElement>
    <!--
      @slot Customized Promoteds List layout.
        @binding {Promoted[]} items - Promoteds to render.
        @binding {GridItem[]} providedItems - A list containing the injected grid items, plus the
        retrieved promoteds, concatenated in the first positions.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, providedItems, animation }">
      <component
        :is="animation"
        v-if="items.length"
        tag="ul"
        class="x-list x-promoteds-list"
        data-test="promoteds-list"
      >
        <li
          v-for="promoted in items"
          :key="promoted.id"
          class="x-promoteds-list__item"
          data-test="promoteds-list-item"
        >
          <!--
            @slot Customized Promoteds List promoted.
                @binding {Promoted} promoted - Promoted data
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
  import GridItemsInjectionMixin from './grid-items-injection.mixin';

  /**
   * It renders a list of promoteds from props or from {@link SearchState.promoteds} by default
   * using the `GridItemsInjectionMixin`.
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
  export default class PromotedsList extends Vue {
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
