<template>
  <!-- This is a div because we support adding an overlay gradient above the image on hover -->
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <div
    @mouseenter.once="userHasHoveredImage = true"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    class="x-picture x-result-picture"
    data-test="result-picture"
  >
    <img
      v-if="shouldLoadNextImage"
      @load="flagImageLoaded"
      @error="flagImageAsFailed"
      loading="lazy"
      :src="pendingImages[0]"
      :style="loaderStyles"
      data-test="result-picture-loader"
      alt=""
      role="presentation"
    />
    <component :is="animation" class="x-picture__image" :appear="false">
      <!-- @slot Fallback image content. It will be rendered when all the images failed -->
      <slot v-if="!loadedImages.length && !pendingImages.length" name="fallback" />

      <!-- @slot Loading image content. It will be rendered while the real image is not loaded -->
      <slot v-else-if="!loadedImages.length" name="placeholder" />

      <img
        v-else
        :key="imageSrc"
        :alt="result.name"
        :src="imageSrc"
        class="x-result-picture__image"
        data-test="result-picture-image"
      />
    </component>
  </div>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { NoElement } from '../no-element';

  /**
   * Component to be reused that renders an `<img>`.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    }
  })
  export default class BaseResultImage extends Vue {
    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * Animation to use when switching between the placeholder, the loaded image, or the failed
     * image fallback.
     *
     * @public
     */
    @Prop({ default: () => NoElement })
    public loadAnimation!: string | typeof Vue;

    /**
     * Animation to use when switching between the loaded image and the hover image.
     *
     * @public
     */
    @Prop()
    public hoverAnimation!: string | typeof Vue | undefined;

    /**
     * Indicates if the next valid image should be displayed on hover.
     *
     * @public
     */
    @Prop({ type: Boolean, default: false })
    public showNextImageOnHover!: boolean;

    /**
     * Copy of the images of the result.
     *
     * It is used as a queue of images to load, once an image loads/fails to load, it is removed
     * from this array.
     *
     * @internal
     */
    protected pendingImages: string[] = [];

    /**
     * Contains the images that have been loaded successfully.
     *
     * @internal
     */
    protected loadedImages: string[] = [];

    /**
     * Indicates if the user is hovering the image.
     *
     * @internal
     */
    protected isHovering = false;

    /**
     * Indicates if the user has hovered the image.
     *
     * @internal
     */
    protected userHasHoveredImage = false;

    /**.
     * Styles to use inline in the image loader, to prevent override from CSS
     *
     * @internal
     */
    protected loaderStyles: Partial<CSSStyleDeclaration> = {
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
    @Watch('result.images', { immediate: true })
    resetImagesState(): void {
      this.pendingImages = [...(this.result.images ?? [])];
      this.loadedImages = this.pendingImages.filter(image => this.loadedImages.includes(image));
    }

    /**
     * Animation to be used.
     *
     * @returns The animation to be used, taking into account if the user has hovered the image.
     *
     * @internal
     */
    protected get animation(): string | typeof Vue {
      return this.userHasHoveredImage
        ? this.hoverAnimation ?? this.loadAnimation
        : this.loadAnimation;
    }

    /**
     * Gets the src from the result image.
     *
     * @returns The result image src.
     *
     * @internal
     */
    protected get imageSrc(): string {
      return this.loadedImages[
        !this.showNextImageOnHover || !this.isHovering ? 0 : this.loadedImages.length - 1
      ];
    }

    /**
     * Indicates if the loader should try to load the next image.
     *
     * @returns True if it should try to load the next image.
     *
     * @internal
     */
    protected get shouldLoadNextImage(): boolean {
      const numImagesToLoad = this.showNextImageOnHover && this.userHasHoveredImage ? 2 : 1;
      return !!this.pendingImages.length && this.loadedImages.length < numImagesToLoad;
    }

    /**
     * Sets an image as failed.
     *
     * @internal
     */
    protected flagImageAsFailed(): void {
      this.pendingImages.shift();
    }

    /**
     * Sets an image as loaded.
     *
     * @internal
     */
    protected flagImageLoaded(): void {
      const image = this.pendingImages.shift();
      if (image) {
        this.loadedImages.push(image);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .x-result-picture {
    // the loaderStyles prop is positioning absolutely to this container
    position: relative;
    min-width: 1px;
    min-height: 1px;

    &__image {
      max-height: 100%;
    }
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
    <img class="x-result-picture-placeholder" src="./placeholder-image.svg"/>
  </template>
  <template #fallback>
    <img class="x-result-picture-fallback" src="./fallback-image.svg"/>
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
