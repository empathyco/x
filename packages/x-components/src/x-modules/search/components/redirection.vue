<template>
  <div v-if="redirection" class="x-redirection">
    <slot v-bind="{ redirection, redirect, abortRedirect }" />
  </div>
</template>

<script lang="ts">
  import { Redirection as RedirectionModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { State } from '../../../components';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';

  /**
   * A redirection is a component that sends the user to a link in the website. It is helpful when
   * there are queries like `help`, `shipping costs`, `my account`, where a link to a section in the
   * website will be more helpful than the set of results returned.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class Redirection extends Vue {
    @State('search', 'redirections')
    public redirections!: RedirectionModel[];

    @Prop({ default: 'auto' })
    public mode!: 'auto' | 'manual';

    @Prop({ default: 5000 })
    public delayMs!: number;

    protected timeoutId!: number;

    protected get redirection(): RedirectionModel | null {
      return this.redirections[0] ?? null;
    }

    @Watch('mode', { immediate: true })
    protected redirectDelayed(mode: this['mode']): void {
      if (this.redirection && mode === 'auto') {
        this.timeoutId = setTimeout(this.redirect.bind(this, this.redirection), this.delayMs);
      }
    }

    protected redirect(redirection: RedirectionModel): void {
      clearTimeout(this.timeoutId);
      this.$x.emit('UserClickedARedirection', redirection);
    }

    protected abortRedirect(): void {
      clearTimeout(this.timeoutId);
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
