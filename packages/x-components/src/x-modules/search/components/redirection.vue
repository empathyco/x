<template>
  <div
    v-if="redirection && $scopedSlots.default"
    class="x-redirection x-message"
    data-test="redirection"
  >
    <slot v-bind="{ redirection, redirect, abortRedirect, isRedirecting, delayInSeconds }" />
  </div>
</template>

<script lang="ts">
  import { Redirection as RedirectionModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { XOn } from '../../../components/decorators/bus.decorators';
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
    public delayInSeconds!: number;

    /**
     * The timeout id, used to cancel the redirection.
     *
     * @internal
     */
    protected timeoutId!: number;

    /**
     * Boolean flag which indicates if the redirection is running.
     *
     * @public
     */
    protected isRedirecting = true;

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
     * Watcher function which adds a setTimeout to the redirect method is the component
     * is in auto mode and there are redirections.
     *
     * @internal
     */
    @Watch('redirections', { immediate: true })
    protected redirectWithDelay(): void {
      this.isRedirecting = true;
      if (this.mode === 'auto' && this.redirection) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.timeoutId = setTimeout(this.redirect, this.delayInSeconds * 1000);
      }
    }

    /**
     * Dispatches the redirection, updating the url.
     *
     * @public
     */
    protected redirect(): void {
      clearTimeout(this.timeoutId);
      this.$x.emit('UserClickedARedirection', this.redirection!);
      window.location.replace(this.redirection!.url);
    }

    /**
     * Stops the redirection, emitting `UserClickedAbortARedirection` event.
     *
     * @public
     */
    protected abortRedirect(): void {
      this.cancelRedirect();
      this.$x.emit('UserClickedAbortARedirection');
    }

    /**
     * Stops the animation if the user search another query.
     *
     * @internal
     */
    @XOn(['UserAcceptedAQuery', 'UserClearedQuery'])
    cancelRedirect(): void {
      clearTimeout(this.timeoutId);
      this.isRedirecting = false;
    }
  }
</script>

<style lang="scss"></style>

<docs lang="mdx">
### Play with the component

In this example, a query has been searched in the search input resulting in a case where the
response has a redirection.

A text box appears bellow the search box indicating that you're going to be redirected to another
web page.

This component has two modes:

- Auto mode means that the redirection will occur after a certain number of seconds passed as a
  property.
- If the value is 0 the redirection will be instantly.
- Manual mode means that the user have to click the redirect button or nothing will happen.

_Type any term in the input field to try it out!_

```vue
<template>
  <Redirection #default="{ redirection, redirect, abortRedirect }">
    <span>In a few seconds you're going to be redirected!</span>
    <span>{{ redirection.url }}</span>
    <button @click="redirection">Redirect now!</button>
    <button @click="abortRedirect">Abort redirection!</button>
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

## Extending the component

Components behaviour can be changed, in this example the mode of the component will be manual
forcing the user to accept the redirection

```vue
<template>
  <Redirection #default="{ redirection, redirect }">
    <span>{{ redirection.url }}</span>
    <button @click="redirect">Redirect now!</button>
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
        mode: 'manual'
      };
    }
  };
</script>
```

## Events

This component emits the following events:

- `UserClickedARedirection` after the user clicks the redirection button.
- `UserClickedAbortARedirection` after the user clicks the abort redirection button.
</docs>
