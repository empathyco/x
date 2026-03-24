<script lang="ts">
import type { Ref } from 'vue'
import type { FeatureLocation } from '../../../types/origin'
import type { ListItem } from '../../../utils/types'
import { computed, defineComponent, h, inject, isRef, provide, ref } from 'vue'
import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { searchXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} list of banners from {@link SearchState.banners}.
 *
 * The component provides a default slot which wraps the whole component with the `banners`
 * plus the `injectedListItems` which also contains the injected list items from
 * the ancestor.
 *
 * It also provides the parent slots to customize the items.
 *
 * @public
 */
export default defineComponent({
  name: 'BannersList',
  xModule: searchXModule.name,
  props: {
    /** Animation component that will be used to animate the banners. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /** The banners to render from the state. */
    const stateItems = useState('search').banners

    /** The provided {@link FeatureLocation} for the component. */
    const injectedLocation = inject<Ref<FeatureLocation> | FeatureLocation>('location')
    const location = isRef(injectedLocation) ? injectedLocation.value : injectedLocation

    /** Number of columns the grid is being divided into. */
    const columnsNumber = ref(0)

    /**
     * Handler to update the number of columns when it changes.
     *
     * @param newColumnsNumber - The new columns value.
     * @param metadata - The {@link @empathyco/x-bus#SubjectPayload.metadata}.
     */
    $x.on('RenderedColumnsNumberChanged', true).subscribe(({ eventPayload, metadata }) => {
      if (metadata.location === location) {
        columnsNumber.value = eventPayload
      }
    })

    /** It injects {@link ListItem} provided by an ancestor as injectedListItems. */
    const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)

    /**
     * The `stateItems` concatenated with the `injectedListItems` if there are.
     *
     * @remarks This computed defines the merging strategy of the `stateItems` and the
     * `injectedListItems`.
     *
     * @returns List of {@link ListItem}.
     */
    const items = computed(() => {
      if (!injectedListItems?.value!.length) {
        return stateItems.value
      }
      const items = [...injectedListItems.value]
      let index = 0
      let previousBannerRow = -1
      for (const item of stateItems.value) {
        const position = item.position ?? 1
        let row = position - 1
        if (row <= previousBannerRow) {
          row = previousBannerRow + 1
        }
        const rowsDiff = row - previousBannerRow
        if (rowsDiff > 1) {
          index += (rowsDiff - 1) * columnsNumber.value
        }
        const isIndexInLoadedPages = index <= items.length
        const areAllPagesLoaded = $x.results.length === $x.totalResults
        if (!isIndexInLoadedPages && !areAllPagesLoaded) {
          break
        }
        items.splice(index, 0, item)
        index++
        previousBannerRow = row
      }
      return items
    })

    /**
     * The computed list items of the entity that uses the mixin.
     *
     * @remarks It should be overridden in the component that uses the mixin and it's intended to be
     * filled with items from the state. Vue doesn't allow mixins as abstract classes.
     * @returns An empty array as fallback in case it is not overridden.
     */
    provide(LIST_ITEMS_KEY as string, items)

    return () => {
      const innerProps = { items: items.value, animation: props.animation }
      // https://vue-land.github.io/faq/forwarding-slots#passing-all-slots
      return slots.default?.(innerProps)[0] ?? h(ItemsList, innerProps, slots)
    }
  },
})
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

<script setup>
import { BannersList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
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

<script setup>
import { BannersList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { FadeAndSlide } from '@empathyco/x-components/animations'

const fadeAndSlide = FadeAndSlide
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

<script setup>
import { BannersList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { BaseGrid } from '@empathyco/x-components'
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

<script setup>
import { BannersList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
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

<script setup>
import { ResultsList, BannersList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```
</docs>
