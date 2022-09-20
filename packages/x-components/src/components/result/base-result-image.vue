<template>
  <picture ref="image" class="x-picture x-result-picture" data-test="result-picture">
    <img
      v-if="!hasImageLoaded && imageSrc"
      @error="flagImageAsFailed"
      @load="flagImageLoaded"
      loading="lazy"
      :src="imageSrc"
      :style="loaderStyles"
      data-test="result-picture-loader"
      alt=""
      role="presentation"
    />
    <component :is="animation" class="x-picture__image">
      <!-- @slot Fallback image content. It will be rendered when all the images failed -->
      <slot v-if="!imageSrc" name="fallback" />

      <!-- @slot Loading image content. It will be rendered while the real image is not loaded -->
      <slot v-else-if="!hasImageLoaded" name="placeholder" />

      <img
        v-else
        :alt="result.name"
        :src="imageSrc"
        class="x-picture__image x-result-picture__image"
        data-test="result-picture-image"
      />
    </component>
  </picture>
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
    public animation!: string | typeof Vue;
    /**
     * An array of images that failed to load.
     *
     * @internal
     */
    protected failedImages: string[] = [];

    /**
     * Indicates if the result image is loaded.
     *
     * @internal
     */
    protected hasImageLoaded = false;

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
     * Gets the src from the result image.
     *
     * @returns The result image src.
     *
     * @internal
     */
    protected get imageSrc(): string {
      const image = this.result.images?.find(image => !this.failedImages.includes(image));
      return image ?? '';
    }

    /**
     * Sets an image as failed.
     *
     * @internal
     */
    protected flagImageAsFailed(): void {
      if (this.imageSrc !== '') {
        this.failedImages.push(this.imageSrc);
      }
    }

    /**
     * Marks an image as loaded.
     *
     * @internal
     */
    protected flagImageLoaded(): void {
      this.hasImageLoaded = true;
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
</docs>
