<script lang="ts">
import { defineComponent, h, provide } from 'vue'
import { ItemsList, LIST_ITEMS_KEY } from '../../../components/index'
import { useState } from '../../../composables/index'
import { AnimationProp } from '../../../types/index'
import { browseXModule } from '../x-module'

export default defineComponent({
  name: 'BrowseResultsList',
  xModule: browseXModule.name,
  props: {
    animation: {
      type: AnimationProp,
      default: 'ul',
    },
  },
  setup(props, { slots }) {
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
