<script lang="ts">
import type { Ref } from 'vue'
import type { ListItem } from '../../../utils/types'
import { computed, defineComponent, h, inject, provide } from 'vue'
import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { searchXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} of vendor results from {@link SearchState.vendorResults}.
 *
 * The component provides a default slot which wraps the whole component with the `vendorResults`
 * plus the `injectedListItems` which also contains the injected list items from
 * the ancestor.
 *
 * It also provides the parent slots to customize the items.
 *
 * @public
 */
export default defineComponent({
  name: 'VendorResultsList',
  xModule: searchXModule.name,
  props: {
    /** Animation component that will be used to animate the vendor results. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /** The vendor results to render from the state. */
    const stateItems = useState('search').vendorResults

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
      for (const item of stateItems.value) {
        const position = item.position ?? 1
        let index = position - 1
        while (items.at(index)?.modelName === 'VendorResult') {
          index++
        }
        const isIndexInLoadedPages = index <= items.length
        const areAllPagesLoaded = $x.results.length === $x.totalResults
        if (!isIndexInLoadedPages && !areAllPagesLoaded) {
          break
        }
        items.splice(index, 0, item)
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
To use this component, vendor results must be provided via the `UserVendorResultsChanged` event.
:::
<!-- prettier-ignore-end -->

Here you have a basic example of how the VendorResultsList is rendered.

_Emit the `UserVendorResultsChanged` event with vendor results to see them in the grid!_

```vue live
<template>
  <div>
    <SearchInput />
    <button @click="addVendorResults">Add Vendor Results</button>
    <VendorResultsList />
  </div>
</template>

<script setup>
import { VendorResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { use$x } from '@empathyco/x-components'

const $x = use$x()

const addVendorResults = () => {
  $x.emit('UserVendorResultsChanged', [
    {
      item: {
        id: 'vendor-1',
        name: 'Vendor Result at Position 1',
        // modelName is set automatically to 'VendorResult'
      },
      position: 1,
    },
    {
      item: {
        id: 'vendor-2',
        name: 'Vendor Result at Position 3',
      },
      position: 3,
    },
  ])
}
</script>
```

### Play with the animation

```vue
<template>
  <div>
    <SearchInput />
    <VendorResultsList :animation="fadeAndSlide" />
  </div>
</template>

<script setup>
import { VendorResultsList } from '@empathyco/x-components/search'
import { FadeAndSlide } from '@empathyco/x-components/animations'
import { SearchInput } from '@empathyco/x-components/search-box'

const fadeAndSlide = FadeAndSlide
</script>
```

### Overriding default content

```vue
<template>
  <div>
    <SearchInput />
    <VendorResultsList #default="{ items, animation }">
      <BaseGrid :items="items" :animation="animation">
        <template #vendor-result="{ item }">
          <span class="custom">⭐ Vendor: {{ item.name }}</span>
        </template>
        <template #result="{ item }">
          <span>Default: {{ item.name }}</span>
        </template>
      </BaseGrid>
    </VendorResultsList>
  </div>
</template>

<script setup>
import { VendorResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { BaseGrid } from '@empathyco/x-components'
</script>
```

### Overriding vendor-result slot

The component provides a `#vendor-result` slot for rendering vendor result items.

```vue
<template>
  <div>
    <SearchInput />
    <VendorResultsList>
      <template #vendor-result="{ item }">
        <div class="featured-item">
          <span class="badge">Featured</span>
          <h3>{{ item.name }}</h3>
          <p>{{ item.price?.value }}</p>
        </div>
      </template>
    </VendorResultsList>
  </div>
</template>

<script setup>
import { VendorResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Data injection

Starting with the `ResultsList` component as root element, you can concat the list of list items
using `VendorResultsList`, `PromotedsList`, `BannersList`, `BaseGrid` or any component that injects the `listItems`
value.

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <VendorResultsList>
        <template #vendor-result="{ item }">
          <span class="featured">⭐ Vendor: {{ item.name }}</span>
        </template>
        <template #result="{ item }">
          <span>Result: {{ item.name }}</span>
        </template>
      </VendorResultsList>
    </ResultsList>
  </div>
</template>

<script setup>
import { ResultsList, VendorResultsList } from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
</script>
```

### Advanced usage with BaseVariableColumnGrid

When using `BaseVariableColumnGrid` or `BaseGrid`, the slot pattern remains the same:

```vue
<template>
  <div>
    <SearchInput />
    <ResultsList>
      <VendorResultsList>
        <PromotedsList>
          <BannersList>
            <BaseVariableColumnGrid :columns="4">
              <template #vendor-result="{ item: result }">
                <MainScrollItem :item="result">
                  <Result :result="result" class="featured" />
                </MainScrollItem>
              </template>

              <template #result="{ item: result }">
                <MainScrollItem :item="result">
                  <Result :result="result" />
                </MainScrollItem>
              </template>

              <template #promoted="{ item: promoted }">
                <Promoted :promoted="promoted" />
              </template>

              <template #banner="{ item: banner }">
                <Banner :banner="banner" />
              </template>
            </BaseVariableColumnGrid>
          </BannersList>
        </PromotedsList>
      </VendorResultsList>
    </ResultsList>
  </div>
</template>

<script setup>
import {
  ResultsList,
  VendorResultsList,
  PromotedsList,
  BannersList,
  Banner,
  Promoted,
} from '@empathyco/x-components/search'
import { SearchInput } from '@empathyco/x-components/search-box'
import { BaseVariableColumnGrid } from '@empathyco/x-components'
import { MainScrollItem } from '@empathyco/x-components/scroll'
import Result from './result.vue'
</script>
```
</docs>
