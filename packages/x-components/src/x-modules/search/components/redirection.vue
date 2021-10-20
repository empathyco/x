<template>
  <div v-if="redirection" class="x-redirection" data-test="redirection">
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
## Basic example

This component provides a slot with two methods, one for redirect and another one for cancelling it,
also provides the first redirection from the search state.

```vue
<template>
  <Redirection>
    <template v-slot="{ redirection, redirect, abortRedirect }">
      <span>{{ redirection.url }}</span>
      <button @click="redirection">Redirect now!</button>
      <button @click="abortRedirect">Abort redirection!</button>
    </template>
  </Redirection>
</template>

<script>
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'RedirectionDemo',
    components: {
      Redirection
    }
  };
</script>
```

## Advance Example

In this example the mode and delayMs data is passed as a prop.

_Here you can see how the `Redirection` component is rendered._

```vue
<template>
  <Redirection :mode="mode" :delayMs="delayMs">
    <template v-slot="{ redirection, redirect, abortRedirect }">
      <span>{{ redirection.url }}</span>
      <button @click="redirection">Redirect now!</button>
      <button @click="abortRedirect">Abort redirection!</button>
    </template>
  </Redirection>
</template>

<script>
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'RedirectionDemo',
    components: {
      Redirection
    },
    data() {
      return {
        mode: 'auto',
        delayMs: 100
      };
    }
  };
</script>
```

## Events

This component emits the `UserClickedARedirection` after the user clicks the redirection button.
</docs>
