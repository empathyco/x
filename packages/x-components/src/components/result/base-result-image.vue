<template>
  <!-- This is a div because using a picture causes the onload event of the image to fire twice. -->
  <div data-test="result-picture" class="x-picture x-result-picture">
    <BaseResultImageLoader
      v-if="!injectedLoadedImages"
      @loadedImage="addLoadedImage"
      :result="result"
    />
    <component :is="animation" :appear="false">
      <!-- @slot Fallback image content. It will be rendered when all the images failed -->
      <!--      <slot v-if="!loadedImages.length" name="fallback" />-->

      <!-- @slot Loading image content. It will be rendered while the real image is not loaded -->
      <slot v-if="!images.length" name="placeholder" />
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
  import { XInject } from '../decorators/injection.decorators';
  import BaseResultImageLoader from './base-result-image-loader.vue';

  /**
   * Component to be reused that renders an `<img>`.
   *
   * @public
   */
  @Component({
    components: {
      BaseResultImageLoader,
      NoElement
    }
  })
  export default class BaseResultImage extends Vue {
    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop()
    protected result!: Result;

    @XInject('loadedImages')
    public injectedLoadedImages!: string[];
    /**
     * Animation to use when switching between the placeholder, the loaded image, or the failed
     * image fallback.
     *
     * @public
     */
    @Prop({ default: () => NoElement })
    public animation!: string | typeof Vue;

    /**
     * Contains the images that have been loaded successfully.
     */
    public loadedImages: string[] = [];

    /**
     * Gets the src from the result image.
     *
     * @returns The result image src.
     *
     * @internal
     */
    protected get imageSrc(): string {
      return this.images[0];
    }

    protected get images(): string[] {
      return this.injectedLoadedImages ?? this.loadedImages;
    }

    protected addLoadedImage(src: string): void {
      this.loadedImages.push(src);
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
