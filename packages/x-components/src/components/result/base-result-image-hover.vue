<template>
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <div
    @mouseenter.once="userHasHoveredImage = true"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    class="x-picture x-result-picture"
  >
    <BaseResultImageLoader
      @loadedImage="addLoadedImage"
      :result="result"
      :imagesToLoad="userHasHoveredImage ? 2 : 1"
    />
    <component :is="animation" class="x-picture__image" :appear="false">
      <img
        v-if="isHovering"
        :src="imageSrc"
        class="x-picture__image x-result-picture__image"
        alt=""
      />
      <slot v-else />
    </component>
  </div>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XProvide } from '../decorators/injection.decorators';
  import { NoElement } from '../no-element';
  import BaseResultImageLoader from './base-result-image-loader.vue';
  @Component({
    components: { BaseResultImageLoader }
  })
  export default class BaseResultImageHover extends Vue {
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
    @Prop({
      default: () => NoElement
    })
    public animation!: string | typeof Vue;

    @Prop({
      required: true
    })
    public result!: Result;

    @XProvide('loadedImages')
    public loadedImages: string[] = [];

    /**
     * Copy of the images of the result.
     *
     * It is used as a queue of images to load, once an image loads/fails to load, it is removed
     * from this array.
     *
     * @internal
     */
    protected images: string[] = this.result.images ?? [];

    protected get imageSrc(): string {
      return this.loadedImages[this.loadedImages.length - 1];
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
