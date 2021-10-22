<template>
  <div v-if="redirection" class="x-redirection" data-test="redirection">
    <slot v-bind="{ redirection, redirect, abortRedirect, isWaiting, delay }" />
  </div>
</template>

<script lang="ts">
  import { Redirection as RedirectionModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { XOn } from '../../../components';
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
      if (this.mode === 'auto' && this.redirection) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.timeoutId = setTimeout(this.redirect, this.delay * 1000);
      }
    }

    /**
     * Dispatches the redirection, emitting `UserClickedARedirection` event.
     *
     * @public
     */
    protected redirect(): void {
      clearTimeout(this.timeoutId);
      this.$x.emit('UserClickedARedirection', this.redirection!);
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

    /**
     * Stops the animation if the user search another query.
     *
     * @internal
     */
    @XOn('UserAcceptedAQuery')
    stopAnimation(): void {
      clearTimeout(this.timeoutId);
    }
  }
</script>

<style lang="scss"></style>

<docs lang="mdx">
## See it in action

Here you have a basic example of how the auto progress bar is rendered.

```vue
<template>
  <AutoProgressBar :isWaiting="isWaiting" :duration="delay" />
</template>

<script>
  export default {
    name: 'AutoProgressBarDemo',
    data() {
      return {
        isWaiting: true,
        delay: 100
      };
    }
  };
</script>
```

### Play with props

In this example, the auto progress bar has been set to do an animation for 5 seconds. There is a way
to cancel the animation by sending the isWaiting prop to false.

```vue
<template>
  <AutoProgressBar :duration="5" :isWaiting="true" />
</template>

<script>
  export default {
    name: 'AutoProgressBarDemo'
  };
</script>
```

## Events

This component emits the following events:

- `UserClickedARedirection` after the user clicks the redirection button.
- `UserClickedAbortARedirection` after the user clicks the abort redirection button.
</docs>
