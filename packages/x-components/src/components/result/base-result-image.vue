<template>
  <!-- This is a div because using a picture causes the onload event of the image to fire twice. -->
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
      :src="images[0]"
      :style="loaderStyles"
      data-test="result-picture-loader"
      alt=""
      role="presentation"
    />
    <component :is="animation" class="x-picture__image" :appear="false">
      <!-- @slot Fallback image content. It will be rendered when all the images failed -->
      <slot v-if="!loadedImages.length && !images.length" name="fallback" />

      <!-- @slot Loading image content. It will be rendered while the real image is not loaded -->
      <slot v-else-if="!loadedImages.length" name="placeholder" />

      <img
        v-else
        :key="imageSrc"
        :alt="result.name"
        :src="imageSrc"
        class="x-picture__image x-result-picture__image"
        data-test="result-picture-image"
      />
    </component>
  </div>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
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
     * Copy of the images of the result.
     *
     * It is used as a queue of images to load, once an image loads/fails to load, it is removed
     * from this array.
     *
     * @internal
     */
    protected images: string[] = this.result.images ?? [];

    /**
     * Contains the images that have been loaded successfully.
     */
    public loadedImages: string[] = [];

    /**
     * Indicates if the next valid image should be displayed on hover.
     *
     * @public
     */
    @Prop({ type: Boolean, default: false })
    public showNextImageOnHover!: boolean;

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
      const nextImgIndex = this.showNextImageOnHover && this.userHasHoveredImage ? 2 : 1;
      return !!this.images.length && this.loadedImages.length < nextImgIndex;
    }

    /**
     * Sets an image as failed.
     *
     * @internal
     */
    protected flagImageAsFailed(): void {
      this.images.shift();
    }

    /**
     * Sets an image as loaded.
     *
     * @internal
     */
    protected flagImageLoaded(): void {
      const image = this.images.shift();
      if (image) {
        this.loadedImages.push(image);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .x-result-picture {
    min-width: 1px;
    min-height: 1px;
    position: relative;

    &__image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
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

### Showing the next image on hover

If a result has multiple images, it can show the next one on hover.

```vue
<BaseResultImage :result="result" showNextImageOnHover />
```
</docs>
