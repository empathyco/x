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
import { vendorXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} list of vendor banners from {@link VendorState.banners}.
 *
 * The component provides a default slot which wraps the whole component with the `vendorBanners`
 * plus the `injectedListItems` which also contains the injected list items from
 * the ancestor.
 *
 * It also provides the parent slots to customize the items.
 *
 * @public
 */
export default defineComponent({
  name: 'VendorBannersList',
  xModule: vendorXModule.name,
  props: {
    /** Animation component that will be used to animate the vendor banners. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /** The vendor banners to render from the state. */
    const stateItems = useState('vendor').banners

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
    const sortedStateItems = computed(() => {
      return [...stateItems.value].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    })

    const items = computed(() => {
      if (!injectedListItems?.value!.length) {
        return sortedStateItems.value
      }
      const items = [...injectedListItems.value]
      let index = 0
      let previousBannerRow = -1
      for (const item of sortedStateItems.value) {
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
