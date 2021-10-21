<template>
  <div v-if="redirection" class="x-redirection" data-test="redirection">
    <slot v-bind="{ redirection, redirect, abortRedirect, isWaiting, delay }" />
  </div>
</template>

<script lang="ts">
  import { Redirection as RedirectionModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
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

    /**
     * The redirection mode. Auto for auto redirection and manual for an user interaction.
     *
     * @public
     */
    @Prop({ default: 'auto' })
    public mode!: 'auto' | 'manual';

    /**
     * The waiting time in seconds until the redirection is made.
     *
     * @remarks this delay only works in auto mode.
     *
     * @public
     */
    @Prop({ default: 0 })
    public delay!: number;

    /**
     * The timeout id, used to cancel the redirection.
     *
     * @internal
     */
    protected timeoutId!: number;

    /**
     * Boolean flag which indicates the waiting time was aborted.
     *
     * @public
     */
    protected isWaiting = true;

    /**
     * Computed property which returns the first recommendation of the state, if any returns null.
     *
     * @returns The first redirection of the state.
     *
     * @internal
     */
    protected get redirection(): RedirectionModel | null {
      return this.redirections[0] ?? null;
    }

    /**
     * Computed property which returns the first recommendation of the state, if any returns null.
     *
     * @internal
     */
    @Watch('redirections', { immediate: true })
    protected redirectDelayed(): void {
      if (this.redirection && this.delay === 0) {
        this.redirect(this.redirection);
      }

      if (this.redirection && this.mode === 'auto') {
        this.timeoutId = setTimeout(this.redirect.bind(this, this.redirection), this.delay * 1000);
      }
    }

    /**
     * Dispatches the redirection, emitting `UserClickedARedirection` event.
     *
     * @param  redirection - The clicked redirection.
     *
     * @public
     */
    protected redirect(redirection: RedirectionModel): void {
      clearTimeout(this.timeoutId);
      this.$x.emit('UserClickedARedirection', redirection);
    }

    /**
     * Stops the redirection, emitting `UserClickedAbortARedirection` event.
     *
     * @public
     */
    protected abortRedirect(): void {
      clearTimeout(this.timeoutId);
      this.isWaiting = false;
      this.$x.emit('UserClickedAbortARedirection');
    }
  }
</script>

<style lang="scss"></style>

<docs lang="mdx">
## Basic example

This component provides a slot with two methods, one for redirect and another one for cancelling it,
also provides the first redirection from the search state.

```vue
<template>
  <Redirection>
    <template v-slot="{ redirection, redirect, abortRedirect, isWaiting }">
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

In this example the mode and delay data is passed as a prop.

_Here you can see how the `Redirection` component is rendered._

```vue
<template>
  <Redirection :mode="mode" :delay="delay">
    <template v-slot="{ redirection, redirect, abortRedirect, isWaiting }">
      <span>{{ redirection.url }}</span>
      <button @click="redirection">Redirect now!</button>
      <button @click="abortRedirect">Abort redirection!</button>
      <AutoProgressBar :isWaiting="isWaiting" />
    </template>
  </Redirection>
</template>

<script>
  import { AutoProgressBar } from '@empathyco/x-components';
  import { Redirection } from '@empathyco/x-components/search';
  export default {
    name: 'RedirectionDemo',
    components: {
      Redirection,
      AutoProgressBar
    },
    data() {
      return {
        mode: 'auto',
        delay: 100
      };
    }
  };
</script>
```

## Events

This component emits the `UserClickedARedirection` after the user clicks the redirection button.
</docs>
