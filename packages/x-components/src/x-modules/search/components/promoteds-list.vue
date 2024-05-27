<template>
  <NoElement>
    <!--
      @slot Customized Promoteds List layout.
        @binding {Promoted[]} items - Promoteds plus the injected list items to render.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, animation }">
      <ItemsList :animation="animation" :items="items">
        <template v-for="(_, slotName) in slots" v-slot:[slotName]="{ item }">
          <slot :name="slotName" :item="item" />
        </template>
      </ItemsList>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import { Promoted } from '@empathyco/x-types';
  import { computed, ComputedRef, defineComponent, inject, provide, Ref } from 'vue';
  import ItemsList from '../../../components/items-list.vue';
  import { ListItem } from '../../../utils/types';
  import { searchXModule } from '../x-module';
  import { AnimationProp } from '../../../types/animation-prop';
  import { use$x } from '../../../composables/use-$x';
  import { useRegisterXModule } from '../../../composables/use-register-x-module';
  import { useState } from '../../../composables/use-state';
  import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts';
  import { NoElement } from '../../../components/no-element';

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

  export default defineComponent({
    name: 'PromotedsList',
    components: {
      ItemsList,
      NoElement
    },
    xModule: searchXModule.name,
    props: {
      /**
       * Animation component that will be used to animate the promoteds.
       *
       * @public
       */
      animation: {
        type: AnimationProp,
        default: 'ul'
      }
    },
    setup(_, { slots }) {
      useRegisterXModule(searchXModule);

      const $x = use$x();

      /**
       * The promoteds to render from the state.
       *
       * @public
       */
      const stateItems: ComputedRef<Promoted[]> = useState('search', ['promoteds']).promoteds;

      /**
       * It injects {@link ListItem} provided by an ancestor as injectedListItems.
       *
       * @internal
       */
      const injectedListItems = inject<Ref<ListItem[] | undefined>>(LIST_ITEMS_KEY as string);

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
      const items = computed((): ListItem[] => {
        if (!injectedListItems?.value!.length) {
          return stateItems.value;
        }
        const items = [...injectedListItems.value];
        for (const item of stateItems.value) {
          const position = item.position ?? 1;
          let index = position - 1;
          while (items.at(index)?.modelName === 'Promoted') {
            index++;
          }
          const isIndexInLoadedPages = index <= items.length;
          const areAllPagesLoaded = $x.results.length === $x.totalResults;
          if (!isIndexInLoadedPages && !areAllPagesLoaded) {
            break;
          }
          items.splice(index, 0, item);
        }
        return items;
      });

      /**
       * The computed list items of the entity that uses the mixin.
       *
       * @remarks It should be overridden in the component that uses the mixin and it's intended to be
       * filled with items from the state. Vue doesn't allow mixins as abstract classes.
       * @returns An empty array as fallback in case it is not overridden.
       * @internal
       */
      provide(LIST_ITEMS_KEY as string, items);

      return {
        items,
        slots
      };
    }
  });
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
