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
 * It renders a {@link ItemsList} of vendor results from {@link VendorState.results}.
 *
 * The component provides a default slot which wraps the whole component with the `vendorResults`
 * plus the `injectedListItems` which also contains the injected list items from
 * the ancestor.
 *
 * If the `queryPreviewHash` prop is provided, the vendor results are retrieved from
 * {@link VendorState.queryPreviews}, scoped to the query preview.
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
    /**
     * The hash of the query preview to render its vendor results. If not provided,
     * the vendor results from the root state are rendered.
     */
    queryPreviewHash: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const $x = use$x()

    /** The vendor results to render from the vendor state. */
    const vendorResults = useState('vendor').results

    /** The vendor results of the query previews, indexed by their query preview hash. */
    const vendorQueryPreviews = useState('vendor').queryPreviews

    /**
     * The vendor results to render. They are read from the query preview state when the
     * `queryPreviewHash` prop is provided, or from the root vendor state otherwise.
     */
    const stateItems = computed(() =>
      props.queryPreviewHash
        ? (vendorQueryPreviews.value?.[props.queryPreviewHash]?.results ?? [])
        : vendorResults.value,
    )

    /** It injects {@link ListItem} provided by an ancestor as injectedListItems. */
    const injectedListItems = inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string)

    /**
     * Indicates if all the results of the current context have been loaded, to know if the
     * vendor results can be inserted in positions of not yet loaded pages.
     *
     * @remarks The query preview results are always considered as fully loaded, since they are
     * retrieved as a fixed batch.
     *
     * @returns Whether all the results are loaded.
     */
    const areAllPagesLoaded = computed(() =>
      props.queryPreviewHash ? true : $x.results.length === $x.totalResults,
    )

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
        if (!isIndexInLoadedPages && !areAllPagesLoaded.value) {
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
