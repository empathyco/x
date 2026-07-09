<script lang="ts">
import type { Ref } from 'vue'
import type { ListItem } from '../../../utils/types'
import { computed, defineComponent, h, inject, provide } from 'vue'
import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types/animation-prop'
import { vendorXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} of vendor results from {@link VendorState.vendorResults}.
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
  xModule: vendorXModule.name,
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
    const stateItems = useState('vendor').vendorResults

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
