<template>
  <component
    :is="banner.url ? 'a' : 'figure'"
    v-if="!imageFailed"
    v-on="banner.url ? anchorEvents() : {}"
    :href="banner.url"
    class="x-banner"
    data-test="banner"
  >
    <img
      @error="imageFailed = true"
      :src="banner.image"
      :alt="banner.title ? banner.title : 'Banner'"
      class="x-banner__image"
      data-test="banner-image"
    />
    <h2 v-if="banner.title" class="x-banner__title" :class="titleClass">
      {{ banner.title }}
    </h2>
  </component>
</template>

<script lang="ts">
  import { Banner as BannerModel } from '@empathyco/x-types';
  import { Component, Mixins, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { dynamicPropsMixin } from '../../../components/dynamic-props.mixin';

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
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class Banner extends Mixins(dynamicPropsMixin(['titleClass'])) {
    /**
     * The banner data.
     *
     * @public
     */
    @Prop({ required: true })
    public banner!: BannerModel;

    /**
     * Flag to handle banner image errors.
     *
     * @public
     */
    protected imageFailed = false;

    /**
     * Emits the banner click event.
     *
     * @internal
     */
    protected emitClickEvent(): void {
      this.$x.emit('UserClickedABanner', this.banner);
    }

    /**
     * Returns the events supported by the anchor.
     *
     * @returns Events supported by the anchor.
     *
     * @internal
     */
    protected anchorEvents(): Partial<{
      [key in keyof GlobalEventHandlersEventMap]: () => void;
    }> {
      return {
        click: () => this.emitClickEvent(),
        auxclick: () => this.emitClickEvent(),
        contextmenu: () => this.emitClickEvent()
      };
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
          title: 'Trendy summer shirts',
          position: 1
        }
      };
    }
  };
</script>
```
</docs>
