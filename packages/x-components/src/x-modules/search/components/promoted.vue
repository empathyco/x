<template>
  <a @click="emitClickEvent" :href="promoted.url" class="x-promoted" data-test="promoted">
    <img :src="promoted.image" class="x-promoted__image" :alt="promoted.title" />
    <h2 class="x-promoted__title" :class="titleClass" data-test="promoted-title">
      {{ promoted.title }}
    </h2>
  </a>
</template>

<script lang="ts">
  import { Promoted as PromotedModel } from '@empathyco/x-types';
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';
  import { dynamicPropsMixin } from '../../../components/dynamic-props.mixin';

  /**
   * A promoted result is just an item that has been inserted into the search results to advertise
   * something. Usually it is one of the first items in the grid, and has the same shape as a
   * result. It just contains a link to the promoted content, an image, and a title.
   *
   * Additionally, this component exposes the following props to modify the classes of the
   * elements: `titleClass`.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule), dynamicPropsMixin(['titleClass'])]
  })
  export default class Promoted extends Vue {
    /**
     * The promoted data.
     *
     * @public
     */
    @Prop({ required: true })
    public promoted!: PromotedModel;

    /**
     * Emits the promoted click event.
     *
     * @internal
     */
    protected emitClickEvent(): void {
      this.$x.emit('UserClickedAPromoted', this.promoted);
    }
  }
</script>

<style lang="scss">
  .x-promoted {
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

In this example promoted data is passed as a prop.

_Here you can see how the `Promoted` component is rendered._

```vue
<template>
  <Promoted :promoted="promoted" />
</template>

<script>
  import { Promoted } from '@empathyco/x-components/search';

  export default {
    name: 'PromotedDemo',
    components: {
      Promoted
    },
    data() {
      return {
        promoted: {
          modelName: 'Promoted',
          id: 'promoted-example',
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

### Customizing the items with classes

The `titleClass` prop can be used to add classes to the promoted title.

```vue
<template>
  <Promoted :promoted="promoted" titleClass="x-bg-neutral-50" />
</template>

<script>
  import { Promoted } from '@empathyco/x-components/search';

  export default {
    name: 'PromotedDemo',
    components: {
      Promoted
    },
    data() {
      return {
        promoted: {
          modelName: 'Promoted',
          id: 'promoted-example',
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
