<template>
  <a
    :href="promoted.url"
    class="x-promoted"
    data-test="promoted"
    @click="emitUserClickedAPromoted"
    @click.right="emitUserClickedAPromoted"
    @click.middle="emitUserClickedAPromoted"
  >
    <img :src="promoted.image" class="x-promoted__image" :alt="promoted.title" />
    <h2 class="x-promoted__title" :class="titleClass" data-test="promoted-title">
      {{ promoted.title }}
    </h2>
  </a>
</template>

<script lang="ts">
import type { Promoted as PromotedModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { useXBus } from '../../../composables/use-x-bus'
import { searchXModule } from '../x-module'

/**
 * A promoted result is just an item that has been inserted into the search results to advertise
 * something. Usually it is one of the first items in the grid, and has the same shape as a
 * result. It just contains a link to the promoted content, an image, and a title.
 *
 * Additionally, this component exposes the following props to modify the classes of the
 * elements: `titleClass`.
 *
 * @public
 */
export default defineComponent({
  name: 'Promoted',
  xModule: searchXModule.name,
  props: {
    /**
     * The promoted data.
     *
     * @public
     */
    promoted: {
      type: Object as PropType<PromotedModel>,
      required: true,
    },
    titleClass: String,
  },
  setup(props) {
    const xBus = useXBus()

    /**
     * Emits the promoted click event.
     *
     * @internal
     */
    const emitUserClickedAPromoted = () => {
      xBus.emit('UserClickedAPromoted', props.promoted)
    }

    return {
      emitUserClickedAPromoted,
    }
  },
})
</script>

<style lang="css" scoped>
.x-promoted {
  display: flex;
  flex-flow: column nowrap;
  text-decoration: none;
}

.x-promoted__image {
  width: 100%;
  object-fit: contain;
}
</style>

<docs lang="mdx">
## Events

This component emits the following event:

- [`UserClickedAPromoted`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted when the user clicks the promoted item (if it has a URL).

## See it in action

In this example, promoted data is passed as a prop.

_Here you can see how the `Promoted` component is rendered._

```vue
<template>
  <Promoted :promoted="promoted" />
</template>

<script setup>
import { Promoted } from '@empathyco/x-components/search'
import { ref } from 'vue'

const promoted = ref({
  modelName: 'Promoted',
  id: 'promoted-example',
  url: 'https://my-website.com/summer-shirts',
  image: 'https://my-website.com/images/summer-shirts.jpg',
  title: 'Trendy summer shirts',
  position: 1,
})
</script>
```

### Customizing the items with classes

The `titleClass` prop can be used to add classes to the promoted title.

```vue
<template>
  <Promoted :promoted="promoted" titleClass="x-bg-neutral-50" />
</template>

<script setup>
import { Promoted } from '@empathyco/x-components/search'
import { ref } from 'vue'

const promoted = ref({
  modelName: 'Promoted',
  id: 'promoted-example',
  url: 'https://my-website.com/summer-shirts',
  image: 'https://my-website.com/images/summer-shirts.jpg',
  title: 'Trendy summer shirts',
  position: 1,
})
</script>
```
</docs>
