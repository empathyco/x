<script lang="ts">
import { defineComponent, h, provide } from 'vue'
import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts'
import ItemsList from '../../../components/items-list.vue'
import { useState } from '../../../composables/use-state'
import { AnimationProp } from '../../../types'
import { browseXModule } from '../x-module'

/**
 * It renders a {@link ItemsList} list with the results from {@link SearchState.results} by
 * default.
 *
 * The component provides a default slot which wraps the whole component with the `results` bound.
 *
 * It also provides the slot result to customize the item, which is within the default slot, with
 * the result bound.
 *
 * @public
 */
export default defineComponent({
  name: 'BrowseResultsList',
  xModule: browseXModule.name,
  props: {
    /** Animation component that will be used to animate the results. */
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props, { slots }) {
    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with `items` key.
     */
    const { results: items } = useState('browse')

    provide(LIST_ITEMS_KEY as string, items)

    return () => {
      const innerProps = { items: items.value, animation: props.animation }
      // https://vue-land.github.io/faq/forwarding-slots#passing-all-slots
      return slots.default?.(innerProps)[0] ?? h(ItemsList, innerProps, slots)
    }
  },
})
</script>
