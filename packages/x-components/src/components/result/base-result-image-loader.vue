<template>
  <img
    v-if="shouldLoadNextImage"
    @load="flagImageLoaded"
    @error="flagImageAsFailed"
    loading="lazy"
    :src="images[0]"
    :style="loaderStyles"
    data-test="result-picture-loader"
    alt="Loading image"
    role="presentation"
  />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';

  @Component
  export default class BaseResultImageLoader extends Vue {
    @Prop({ default: 1 })
    public imagesToLoad!: number;

    @Prop({
      required: true
    })
    public result!: Result;

    protected images: string[] = this.result.images ?? [];

    public loadedImages: string[] = [];

    protected loaderStyles: Partial<CSSStyleDeclaration> = {
      position: 'absolute !important',
      top: '0 !important',
      left: '0 !important',
      width: '100% !important',
      height: '100% !important',
      pointerEvents: 'none !important',
      visibility: 'hidden !important'
    };

    protected get shouldLoadNextImage(): boolean {
      return !!this.images.length && this.loadedImages.length < this.imagesToLoad;
    }

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
        this.$emit('loadedImage', image);
        this.loadedImages.push(image);
      }
    }
  }
</script>
