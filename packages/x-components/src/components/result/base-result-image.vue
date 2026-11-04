<template>
  <!-- This is a div because using a picture causes the onload event of the image to fire twice. -->
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <div
    class="x-result-picture xds:picture"
    data-test="result-picture"
    @mouseenter.once="userHasHoveredImage = true"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <img
      v-if="shouldLoadNextImage"
      v-bind="imageAttrs"
      :loading="loading"
      :src="pendingImages[0].src"
      :srcset="pendingImages[0].srcset"
      :sizes="sizes"
      :style="loaderStyles"
      class="xds:picture-image"
      data-test="result-picture-loader"
      alt=""
      role="presentation"
      @load="flagImageLoaded"
      @error="flagImageAsFailed"
    />
    <component :is="animation" class="xds:picture-image" :appear="false">
      <!-- @slot Fallback image content. It will be rendered when all the images failed -->
      <slot v-if="!loadedImages.length && !pendingImages.length" name="fallback" />

      <!-- @slot Loading image content. It will be rendered while the real image is not loaded -->
      <slot v-else-if="!loadedImages.length" name="placeholder" />

      <img
        v-else
        v-bind="imageAttrs"
        :key="imageSrc"
        :alt="result.name"
        :src="imageSrc"
        :srcset="imageSrcset"
        :sizes="sizes"
        class="x-result-picture-image"
        data-test="result-picture-image"
      />
    </component>
  </div>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType, Ref, StyleValue } from 'vue'
import { computed, defineComponent, ref, useAttrs, watch } from 'vue'

import { AnimationProp } from '../../types'
import { NoAnimation } from '../animations'

/**
 * An entry of the images queue: the image `src` and its optional `srcset`.
 *
 * @internal
 */
interface ImageEntry {
  /** Index of the image inside `result.images`. */
  index: number
  /** The image URL. */
  src: string
  /** Responsive candidates for the image, if provided. */
  srcset?: string
}

/**
 * Component to be reused that renders an `<img>`.
 *
 * Additional `<img>` attributes passed to the component (e.g. `decoding`, `crossorigin`,
 * `referrerpolicy`, `fetchpriority`, `width` and `height`) are forwarded to the rendered
 * images, while `class`, `style` and event listeners keep falling through to the root
 * element, as before. Use the `imageLoaded` and `imageError` events to observe the image
 * loading state.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseResultImage',
  props: {
    /** (Required) The {@link @empathyco/x-types#Result} information. */
    result: {
      type: Object as PropType<Result>,
      required: true,
    },
    /**
     * Animation to use when switching between the placeholder, the loaded image, or the failed
     * image fallback.
     */
    loadAnimation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /** Animation to use when switching between the loaded image and the hover image. */
    hoverAnimation: {
      type: AnimationProp,
    },
    /**
     * Indicates if the next valid image should be displayed on hover.
     *
     * @public
     */
    showNextImageOnHover: {
      type: Boolean,
      default: false,
    },
    /**
     * Responsive image candidates (`srcset`).
     *
     * - A single string is applied to every image of the result (e.g.
     *   `"image-480.jpg 480w, image-1024.jpg 1024w"`).
     * - An array is parallel to `result.images`, so each image can have its own candidates.
     *
     * When provided, the `src` is kept as a fallback for browsers without `srcset` support.
     *
     * @public
     */
    srcset: {
      type: [String, Array] as PropType<string | (string | undefined)[]>,
    },
    /**
     * The sizes of the image for different page layouts (`sizes`).
     *
     * It is shared by all the images of the result, since it depends on the layout and not on
     * the image. Pass it together with `srcset`, since it is ignored otherwise.
     *
     * @public
     */
    sizes: {
      type: String,
    },
    /**
     * Image loading mode.
     *
     * @public
     */
    loading: {
      type: String as PropType<'lazy' | 'eager'>,
      default: 'lazy',
    },
  },
  emits: ['imageLoaded', 'imageError'],
  setup(props, { emit }) {
    const attrs = useAttrs()

    /**
     * Additional `<img>` attributes passed to the component (e.g. `decoding`,
     * `crossorigin`, `fetchpriority`, `width`, `height`), forwarded to the rendered images.
     *
     * Event listeners are excluded so they don't reach the hidden loader: they keep
     * falling through to the root element, and the image loading state is exposed through
     * the `imageLoaded` and `imageError` events.
     *
     * @internal
     */
    const imageAttrs = computed(() =>
      Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith('on'))),
    )

    /**
     * Copy of the images of the result.
     *
     * It is used as a queue of images to load, once an image loads/fails to load, it is removed
     * from this array.
     *
     * @internal
     */
    const pendingImages: Ref<ImageEntry[]> = ref([])

    /**
     * Contains the images that have been loaded successfully.
     *
     * @internal
     */
    const loadedImages: Ref<ImageEntry[]> = ref([])

    /**
     * Indicates if the user is hovering the image.
     *
     * @internal
     */
    const isHovering = ref(false)

    /**
     * Indicates if the user has hovered the image.
     *
     * @internal
     */
    const userHasHoveredImage = ref(false)

    /**
     * Styles to use inline in the image loader, to prevent override from CSS
     *
     * @internal
     */
    const loaderStyles: StyleValue = {
      // csstype issue: https://github.com/frenic/csstype/issues/160
      position: 'absolute !important' as 'absolute',
      top: '0 !important' as '0',
      left: '0 !important' as '0',
      width: '100% !important' as '100%',
      height: '100% !important' as '100%',
      pointerEvents: 'none !important' as 'none',
      visibility: 'hidden !important' as 'hidden',
    }

    /**
     * Resolves the `srcset` to use for the image at the given index.
     *
     * @param index - Index of the image inside `result.images`.
     *
     * @returns The `srcset` for that image, if any.
     *
     * @internal
     */
    const resolveSrcset = (index: number): string | undefined =>
      Array.isArray(props.srcset) ? props.srcset[index] : props.srcset

    /**
     * Initializes images state and resets when the result's images change.
     *
     * @internal
     */
    watch(
      () => props.result.images,
      () => {
        pendingImages.value = (props.result.images ?? []).map((src, index) => ({
          index,
          src,
          srcset: resolveSrcset(index),
        }))
        loadedImages.value = pendingImages.value.filter(image =>
          loadedImages.value.some(loadedImage => loadedImage.src === image.src),
        )
      },
      { immediate: true },
    )

    /**
     * Animation to be used.
     *
     * @returns The animation to be used, taking into account if the user has hovered the image.
     *
     * @internal
     */
    const animation = computed(() => {
      return userHasHoveredImage.value
        ? (props.hoverAnimation ?? props.loadAnimation)
        : props.loadAnimation
    })

    /**
     * Gets the currently loaded image.
     *
     * @returns The currently loaded image entry, or undefined if none has been loaded.
     *
     * @internal
     */
    const currentImage = computed(() => {
      return loadedImages.value[
        !props.showNextImageOnHover || !isHovering.value ? 0 : loadedImages.value.length - 1
      ]
    })

    /**
     * Gets the src of the currently loaded image.
     *
     * @returns The current image src.
     *
     * @internal
     */
    const imageSrc = computed(() => currentImage.value?.src)

    /**
     * Gets the srcset of the currently loaded image.
     *
     * @returns The current image srcset, if any.
     *
     * @internal
     */
    const imageSrcset = computed(() => currentImage.value?.srcset)

    /**
     * Indicates if the loader should try to load the next image.
     *
     * @returns True if it should try to load the next image.
     *
     * @internal
     */
    const shouldLoadNextImage = computed(() => {
      const numImagesToLoad = props.showNextImageOnHover && userHasHoveredImage.value ? 2 : 1
      return !!pendingImages.value.length && loadedImages.value.length < numImagesToLoad
    })

    /**
     * Sets an image as failed.
     *
     * @param event - The error event of the loader image.
     *
     * @internal
     */
    const flagImageAsFailed = () => {
      const image = pendingImages.value.shift()
      if (image) {
        emit('imageError', { index: image.index, src: image.src, srcset: image.srcset })
      }
    }

    /**
     * Sets an image as loaded.
     *
     * @param event - The load event of the loader image.
     *
     * @internal
     */
    const flagImageLoaded = (event: Event) => {
      const image = pendingImages.value.shift()
      if (image) {
        loadedImages.value.push(image)
        const element = event.target as HTMLImageElement
        emit('imageLoaded', {
          index: image.index,
          src: image.src,
          srcset: image.srcset,
          currentSrc: element.currentSrc || image.src,
          element,
        })
      }
    }

    return {
      imageAttrs,
      pendingImages,
      loadedImages,
      isHovering,
      userHasHoveredImage,
      loaderStyles,
      animation,
      imageSrc,
      imageSrcset,
      shouldLoadNextImage,
      flagImageAsFailed,
      flagImageLoaded,
    }
  },
})
</script>

<style lang="css" scoped>
.x-result-picture {
  position: relative;
  min-width: 1px;
  min-height: 1px;
}

.x-result-picture-image {
  max-width: 100%;
  max-height: 100%;
}
</style>

<docs lang="mdx">
## Examples

### Basic example

This component is for the result image. It may be part of the search result page, recommendations or
other section which needs to include results.

The result prop is required. It will render a `<img/>` with the result image:

```vue
<template>
  <BaseResultImage :result="result" />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
const result = {
  name: 'Jacket',
  images: ['https://some-image-url.com/image1.jpg'],
}
</script>
```

### Responsive images with `srcset` and `sizes`

The `srcset` and `sizes` props are used to deliver the right image candidate according to the
device and the layout (like the native `<img>` attributes).

`srcset` can be a single string, applied to all the images of the result, or an array parallel to
`result.images`, so each image can have its own candidates.

```vue
<template>
  <BaseResultImage
    :result="result"
    srcset="image1-480.jpg?width=400 480w, image1-1024.jpg?width=1024 1024w"
    sizes="(min-width: 600px) 33vw, 100vw"
  />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
const result = {
  name: 'Jacket',
  images: ['https://some-image-url.com/image1.jpg'],
}
</script>
```

The `src` of the image is always kept, so it works as a fallback when `srcset` is not supported.

### Showing the next image on hover

If a result has multiple images, it can show the next one on hover.

```vue
<template>
  <BaseResultImage :result="result" showNextImageOnHover />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
const result = {
  name: 'Jacket',
  images: ['https://some-image-url.com/image1.jpg', 'https://some-image-url.com/image2.jpg'],
}
</script>
```

### Customizing slots content

Fallback and placeholder contents can be customized.

The fallback slot allows you to replace the content of the fallback image.

The other slot is called `placeholder`, and allows you to set the image that its going to be
displayed while the real one is loaded.

```vue
<template>
  <BaseResultImage :result="result">
    <template #placeholder>
      <img alt="Placeholder image" src="./placeholder-image.svg" />
    </template>
    <template #fallback>
      <img alt="Fallback image" src="./fallback-image.svg" />
    </template>
  </BaseResultImage>
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
const result = {
  name: 'Jacket',
  images: ['https://some-image-url.com/image1.jpg'],
}
</script>
```

### Customizing the animations

Two animations can be used in this component.

The `loadAnimation` is used to transition between the placeholder, the fallback and the image.

The `hoverAnimation` is used to transition between the image and the hover image, if the
`showNextImageOnHover` prop is `true`.

`hoverAnimation` will default to `loadAnimation` if it is not provided.

```vue
<template>
  <BaseResultImage
    :result="result"
    :loadAnimation="loadAnimation"
    :hoverAnimation="hoverAnimation"
    showNextImageOnHover
  />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
import { CrossFade, CollapseHeight } from '@empathyco/x-components/animations'
const loadAnimation = CrossFade
const hoverAnimation = CollapseHeight
const result = {
  name: 'Jacket',
  images: ['https://some-image-url.com/image1.jpg', 'https://some-image-url.com/image2.jpg'],
}
</script>
```

### Optimizing the first result for LCP

By default, images are loaded lazily. For the first (above-the-fold) result of the search results
page, the image is usually the **Largest Contentful Paint (LCP)** element: eager-loading it with
a high fetch priority avoids waiting for the lazy-load viewport check and lets the browser start
the request immediately.

Combine it with `width` and `height` so the browser can prioritize and reserve the space of the
LCP element from the start:

```vue
<template>
  <!-- First, above-the-fold result -->
  <BaseResultImage
    :result="firstResult"
    loading="eager"
    fetchPriority="high"
    :width="256"
    :height="371"
  />
  <!-- All the remaining results keep the default lazy loading -->
  <BaseResultImage v-for="result in otherResults" :key="result.id" :result="result" />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
</script>
```

Only the above-the-fold results should use `loading="eager"`; keep the rest lazy to avoid
requesting more images than needed.

### Avoiding layout shift (CLS)

Passing `width` and `height` (the intrinsic dimensions of the image) helps the browser reserve
the right space before the image is loaded, preventing the layout shift caused by the image
replacing the placeholder.

```vue
<template>
  <BaseResultImage :result="result" :width="256" :height="371" />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
</script>
```

### Passing additional image attributes

Any additional `<img>` attribute passed to the component is forwarded to the rendered images
(the hidden preload image and the visible one), so there is no need for a specific prop per
attribute:

```vue
<template>
  <BaseResultImage
    :result="result"
    decoding="async"
    crossorigin="anonymous"
    fetchpriority="high"
    referrerpolicy="no-referrer"
    :width="256"
    :height="371"
  />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
</script>
```

`class`, `style` and event listeners are not forwarded to the images: they keep falling through
to the root element. Observe the image loading state with the `imageLoaded` and `imageError`
events instead.

### Image loading events

The component emits `imageLoaded` when an image finishes loading, and `imageError` when an image
fails to load (the next one of the queue will be tried).

```vue
<template>
  <BaseResultImage :result="result" @imageLoaded="imageLoaded" @imageError="imageError" />
</template>

<script setup>
import { BaseResultImage } from '@empathyco/x-components'
const result = {
  name: 'Jacket',
  images: ['https://some-image-url.com/image1.jpg'],
}
const imageLoaded = ({ index, src, currentSrc }) => {
  // For example, track the candidate actually downloaded by the browser
  console.log(`Image ${index} loaded: ${src} (downloaded ${currentSrc})`)
}
const imageError = ({ index, src }) => {
  console.log(`Image ${index} failed: ${src}`)
}
</script>
```
</docs>
