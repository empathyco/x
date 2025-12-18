<template>
  <component
    :is="banner.url ? 'a' : 'figure'"
    v-if="!imageFailed"
    :href="banner.url"
    class="x-banner"
    data-test="banner"
    v-on="banner.url ? anchorEvents() : {}"
  >
    <img
      :src="banner.image"
      :alt="banner.title ? banner.title : 'Banner'"
      class="x-banner__image"
      data-test="banner-image"
      @error="imageFailed = true"
    />
    <h2 v-if="banner.title" class="x-banner__title" :class="titleClass" data-test="banner-title">
      {{ banner.title }}
    </h2>
  </component>
</template>

<script lang="ts">
import type { Banner as BannerModel } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import { useXBus } from '../../../composables/use-x-bus'
import { searchXModule } from '../x-module'

/**.
 * A banner result is just an item that has been inserted into the search results to advertise
 * something. Usually it is the first item in the grid or it can be placed in the middle of them
 * and fill the whole row where appears.
 * The banner may be clickable or non-clickable depending on whether it has an associated URL
 * or not. It contains an image and, optionally, a title. In case the image does not
 * load due to an error the banner will not be rendered.
 *
 * Additionally, this component exposes the following props to modify the classes of the
 * elements: `titleClass`.
 *
 * @public
 */
export default defineComponent({
  name: 'Banner',
  xModule: searchXModule.name,
  props: {
    /**
     * The banner data.
     *
     * @public
     */
    banner: {
      type: Object as PropType<BannerModel>,
      required: true,
    },
    titleClass: String,
  },
  setup(props) {
    const xBus = useXBus()

    /**
     * Flag to handle banner image errors.
     *
     * @public
     */
    const imageFailed = ref(false)

    /**
     * Emits the banner click event.
     *
     * @internal
     */
    const emitClickEvent = (): void => {
      xBus.emit('UserClickedABanner', props.banner)
    }

    /**
     * Returns the events supported by the anchor.
     *
     * @returns Events supported by the anchor.
     *
     * @internal
     */
    const anchorEvents = (): Partial<{
      [key in keyof GlobalEventHandlersEventMap]: () => void
    }> => ({
      click: () => emitClickEvent(),
      auxclick: () => emitClickEvent(),
      contextmenu: () => emitClickEvent(),
    })

    return {
      imageFailed,
      anchorEvents,
    }
  },
})
</script>

<style lang="css" scoped>
.x-banner {
  display: flex;
  flex-flow: column nowrap;
  text-decoration: none;
}

.x-banner__image {
  width: 100%;
  object-fit: contain;
}
</style>

<docs lang="mdx">
## Events

This component doesn't emit events.

## See it in action

In this example banned data is passed as a prop.

_Here you can see how the `Banner` component is rendered._

```vue
<template>
  <Banner :banner="banner" />
</template>

<script>
import { Banner } from '@empathyco/x-components/search'
export default {
  name: 'BannerDemo',
  components: {
    Banner,
  },
  data() {
    return {
      banner: {
        modelName: 'Banner',
        id: 'banner-example',
        url: 'https://my-website.com/summer-shirts',
        image: 'https://my-website.com/images/summer-shirts.jpg',
        title: 'Trendy summer shirts',
        position: 1,
      },
    }
  },
}
</script>
```

### Customizing the items with classes

The `titleClass` prop can be used to add classes to the banner title.

```vue
<template>
  <Banner :banner="banner" titleClass="bg-neutral-50" />
</template>

<script>
import { Banner } from '@empathyco/x-components/search'
export default {
  name: 'BannerDemo',
  components: {
    Banner,
  },
  data() {
    return {
      banner: {
        modelName: 'Banner',
        id: 'banner-example',
        url: 'https://my-website.com/summer-shirts',
        image: 'https://my-website.com/images/summer-shirts.jpg',
        title: 'Trendy summer shirts',
        position: 1,
      },
    }
  },
}
</script>
```
</docs>
