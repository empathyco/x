<template>
  <a @click="emitClickEvent" :href="banner.url" class="x-banner" data-test="banner">
    <img :src="banner.image" class="x-banner__image" :alt="banner.title" />
    <h2 class="x-banner__title">{{ banner.title }}</h2>
  </a>
</template>

<script lang="ts">
  import { Banner as BannerModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  /**
   * A banner result is just an item that has been inserted into the search results to advertise
   * something. Usually it is the first item in the grid or it can be placed in the middle of them
   * and fill the whole row where appears. It just contains a link to the banner content, an image
   * and a title.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class Banner extends Vue {
    /**
     * The banner data.
     *
     * @public
     */
    @Prop({ required: true })
    public banner!: BannerModel;

    /**
     * Emits the banner click event.
     *
     * @internal
     */
    protected emitClickEvent(): void {
      this.$x.emit('UserClickedABanner', this.banner);
    }
  }
</script>

<style lang="scss">
  .x-banner {
    display: flex;
    flex-flow: column nowrap;
    text-decoration: none;

    &__image {
      width: 100%;
      object-fit: contain;
    }
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
  import { Banner } from '@empathyco/x-components/search';
  export default {
    name: 'BannerDemo',
    components: {
      Banner
    },
    data() {
      return {
        banner: {
          modelName: 'Banner',
          id: 'banner-example',
          url: 'https://my-website.com/summer-shirts',
          image: 'https://my-website.com/images/summer-shirts.jpg',
          title: 'Trendy summer shirts'
        }
      };
    }
  };
</script>
```
</docs>
