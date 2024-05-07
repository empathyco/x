<template>
  <div v-if="items.length > 0">
    <!--
      @slot Customized BannersList layout.
        @binding {Banner[]} items - Banners plus the injected list items to render.
        @binding {Vue | string} animation - Animation to animate the elements.
    -->
    <slot v-bind="{ items, animation }">
      <ItemsList :animation="animation" :items="items">
        <template v-for="(_, slotName) in slots" v-slot:[slotName]="{ item }">
          <slot :name="slotName" :item="item" />
        </template>
      </ItemsList>
    </slot>
  </div>
</template>

<script lang="ts">
  import { Banner } from '@empathyco/x-types';
  import { computed, ComputedRef, defineComponent, inject, provide, ref, Ref } from 'vue';
  import { Observable } from 'rxjs';
  import { EventPayload, SubjectPayload } from '@empathyco/x-bus';
  import ItemsList from '../../../components/items-list.vue';
  import { FeatureLocation } from '../../../types/origin';
  import { ListItem } from '../../../utils/types';
  import { searchXModule } from '../x-module';
  import { AnimationProp } from '../../../types/animation-prop';
  import { use$x } from '../../../composables/use-$x';
  import { useRegisterXModule } from '../../../composables/use-register-x-module';
  import { useState } from '../../../composables/use-state';
  import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { XEventsTypes } from '../../../wiring/events.types';

  /**
   * It renders a {@link ItemsList} list of banners from {@link SearchState.banners} by
   * default using the `ItemsInjectionMixin`.
   *
   * The component provides a default slot which wraps the whole component with the `banners`
   * plus the `searchInjectedItems` which also contains the injected list items from
   * the ancestor.
   *
   * It also provides the parent slots to customize the items.
   *
   * @public
   */
  export default defineComponent({
    name: 'BannersList',
    components: {
      ItemsList
    },
    xModule: searchXModule.name,
    props: {
      /**
       * Animation component that will be used to animate the banners.
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
       * The banners to render from the state.
       *
       * @public
       */
      const stateItems: ComputedRef<Banner[]> = useState('search', ['banners']).banners;

      /**
       * The provided {@link FeatureLocation} for the component.
       *
       * @internal
       */
      const injectedLocation = inject<Ref<FeatureLocation> | FeatureLocation | undefined>(
        'location',
        undefined
      );
      const location =
        typeof injectedLocation === 'object' && 'value' in injectedLocation
          ? injectedLocation.value
          : injectedLocation;

      /**
       * Number of columns the grid is being divided into.
       *
       * @internal
       */
      let columnsNumber = ref(0);

      /**
       * Handler to update the number of columns when it changes.
       *
       * @param newColumnsNumber - The new columns value.
       * @param metadata - The {@link @empathyco/x-bus#SubjectPayload.metadata}.
       *
       * @internal
       */
      (
        $x.on('RenderedColumnsNumberChanged', true) as unknown as Observable<
          SubjectPayload<EventPayload<XEventsTypes, keyof XEventsTypes>, WireMetadata>
        >
      ).subscribe(({ eventPayload, metadata }) => {
        if (metadata.location === location) {
          columnsNumber.value = eventPayload as number;
        }
      });

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
        let index = 0,
          previousBannerRow = -1;
        for (const item of stateItems.value) {
          const position = item.position ?? 1;
          let row = position - 1;
          if (row <= previousBannerRow) {
            row = previousBannerRow + 1;
          }
          const rowsDiff = row - previousBannerRow;
          if (rowsDiff > 1) {
            index += (rowsDiff - 1) * columnsNumber.value;
          }
          const isIndexInLoadedPages = index <= items.length;
          const areAllPagesLoaded = $x.results.length === $x.totalResults;
          if (!isIndexInLoadedPages && !areAllPagesLoaded) {
            break;
          }
          items.splice(index, 0, item);
          index++;
          previousBannerRow = row;
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
        <template #banner="{ item }">
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

Starting with the `ResultsList` component as root element, you can concat the list of list items
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
