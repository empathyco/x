<template>
  <!-- This is a div because using a picture causes the onload event of the image to fire twice. -->
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <div
    @mouseenter.once="userHasHoveredImage = true"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    class="x-result-picture x-picture"
    data-test="result-picture"
  >
    <img
      v-if="shouldLoadNextImage"
      @load="flagImageLoaded"
      @error="flagImageAsFailed"
      loading="lazy"
      :src="pendingImages[0]"
      :style="loaderStyles"
      class="x-picture-image"
      data-test="result-picture-loader"
      alt=""
      role="presentation"
    />
    <component :is="animation" class="x-picture-image" :appear="false">
      <!-- @slot Fallback image content. It will be rendered when all the images failed -->
      <slot v-if="!loadedImages.length && !pendingImages.length" name="fallback" />

      <!-- @slot Loading image content. It will be rendered while the real image is not loaded -->
      <slot v-else-if="!loadedImages.length" name="placeholder" />

      <img
        v-else
        :key="imageSrc"
        :alt="result.name"
        :src="imageSrc"
        class="x-result-picture-image"
        data-test="result-picture-image"
      />
    </component>
  </div>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import { computed, defineComponent, PropType, Ref, ref, watch } from 'vue';
  import { NoAnimation } from '../animations';
  import { AnimationProp } from '../../types';

  /**
   * Component to be reused that renders an `<img>`.
   *
   * @public
   */
  export default defineComponent({
    name: 'BaseResultImage',
    props: {
      /** (Required) The {@link @empathyco/x-types#Result} information. */
      result: {
        type: Object as PropType<Result>,
        required: true
      },
      /**
       * Animation to use when switching between the placeholder, the loaded image, or the failed
       * image fallback.
       */
      loadAnimation: {
        type: AnimationProp,
        default: () => NoAnimation
      },
      /** Animation to use when switching between the loaded image and the hover image. */
      hoverAnimation: {
        type: AnimationProp
      },
      /**
       * Indicates if the next valid image should be displayed on hover.
       *
       * @public
       */
      showNextImageOnHover: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      /**
       * Copy of the images of the result.
       *
       * It is used as a queue of images to load, once an image loads/fails to load, it is removed
       * from this array.
       *
       * @internal
       */
      const pendingImages: Ref<string[]> = ref([]);

      /**
       * Contains the images that have been loaded successfully.
       *
       * @internal
       */
      const loadedImages: Ref<string[]> = ref([]);

      /**
       * Indicates if the user is hovering the image.
       *
       * @internal
       */
      const isHovering = ref(false);

      /**
       * Indicates if the user has hovered the image.
       *
       * @internal
       */
      const userHasHoveredImage = ref(false);

      /**.
       * Styles to use inline in the image loader, to prevent override from CSS
       *
       * @internal
       */
      const loaderStyles: Partial<CSSStyleDeclaration> = {
        position: 'absolute !important',
        top: '0 !important',
        left: '0 !important',
        width: '100% !important',
        height: '100% !important',
        pointerEvents: 'none !important',
        visibility: 'hidden !important'
      };

      /**
       * Initializes images state and resets when the result's images change.
       *
       * @internal
       */
      watch(
        () => props.result.images,
        () => {
          pendingImages.value = [...(props.result.images ?? [])];
          loadedImages.value = pendingImages.value.filter(image =>
            loadedImages.value.includes(image)
          );
        },
        { immediate: true }
      );

      /**
       * Animation to be used.
       *
       * @returns The animation to be used, taking into account if the user has hovered the image.
       *
       * @internal
       */
      const animation = computed(() => {
        return userHasHoveredImage.value
          ? props.hoverAnimation ?? props.loadAnimation
          : props.loadAnimation;
      });

      /**
       * Gets the src from the result image.
       *
       * @returns The result image src.
       *
       * @internal
       */
      const imageSrc = computed(() => {
        return loadedImages.value[
          !props.showNextImageOnHover || !isHovering.value ? 0 : loadedImages.value.length - 1
        ];
      });

      /**
       * Indicates if the loader should try to load the next image.
       *
       * @returns True if it should try to load the next image.
       *
       * @internal
       */
      const shouldLoadNextImage = computed(() => {
        const numImagesToLoad = props.showNextImageOnHover && userHasHoveredImage.value ? 2 : 1;
        return !!pendingImages.value.length && loadedImages.value.length < numImagesToLoad;
      });

      /**
       * Sets an image as failed.
       *
       * @internal
       */
      const flagImageAsFailed = () => {
        pendingImages.value.shift();
      };

      /**
       * Sets an image as loaded.
       *
       * @internal
       */
      const flagImageLoaded = () => {
        const image = pendingImages.value.shift();
        if (image) {
          loadedImages.value.push(image);
        }
      };

      return {
        pendingImages,
        loadedImages,
        isHovering,
        userHasHoveredImage,
        loaderStyles,
        animation,
        imageSrc,
        shouldLoadNextImage,
        flagImageAsFailed,
        flagImageLoaded
      };
    }
  });
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
<BaseResultImage :result="result" />
```

### Showing the next image on hover

If a result has multiple images, it can show the next one on hover.

```vue
<BaseResultImage :result="result" showNextImageOnHover />
```

### Customizing slots content

Fallback and placeholder contents can be customized.

The fallback slot allows you to replace the content of the fallback image.

The other slot is called `placeholder`, and allows you to set the image that its going to be
displayed while the real one is loaded.

```vue
<BaseResultImage :result="result">
  <template #placeholder>
    <img alt="Placeholder image" src="./placeholder-image.svg"/>
  </template>
  <template #fallback>
    <img alt="Fallback image" src="./fallback-image.svg"/>
  </template>
</BaseResultImage>
```

### Customizing the animations

Two animations can be used this component.

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

<script>
  import { BaseResultImage } from '@empathyco/x-components';
  import { CrossFade, CollapseHeight } from '@empathyco/x-components/animations';

  export default {
    name: 'BaseResultImageAnimations',
    components: {
      BaseResultImage
    },
    data() {
      return {
        loadAnimation: CrossFade,
        hoverAnimation: CollapseHeight,
        result: {
          name: 'jacket',
          images: ['https://some-image', 'https://some-image-2']
        }
      };
    }
  };
</script>
```
</docs>
