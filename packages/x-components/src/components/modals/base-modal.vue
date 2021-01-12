<template>
  <component :is="animation">
    <div v-if="open" class="x-modal" data-test="modal">
      <div @click.stop class="x-modal__content" data-test="modal-content">
        <!-- @slot (Required) Modal container content -->
        <slot />
      </div>
    </div>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { noElementComponent } from '../no-element';

  /**
   * Base component with no XPlugin dependencies that serves as a utility for constructing more
   * complex modals.
   *
   * @public
   */
  @Component
  export default class BaseModal extends Vue {
    /**
     * Animation to use for opening/closing the modal.
     */
    @Prop({ default: () => noElementComponent })
    public animation!: Vue | string;

    /**
     * Determines if the modal is open or not.
     */
    @Prop({ required: true })
    public open!: boolean;

    protected beforeDestroy(): void {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      document.body.removeEventListener('click', this.emitClickInBody);
    }

    protected mounted(): void {
      /* Watcher added after mount to prevent SSR from breaking */
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.$watch('open', this.syncBodyListeners, { immediate: true });
    }

    protected syncBodyListeners(isOpen: boolean): void {
      if (isOpen) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        document.body.addEventListener('click', this.emitClickInBody);
      } else {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        document.body.removeEventListener('click', this.emitClickInBody);
      }
    }

    protected emitClickInBody(event: MouseEvent): void {
      this.$emit('click:body', event);
    }
  }
</script>

<style lang="scss" scoped>
  .x-modal {
    background-color: rgba(0, 0, 0, 0.7);

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;

    z-index: 1;
  }
</style>

<docs lang="mdx">
# Examples

The `BaseModal` is a simple component that serves to create complex modals. Its open state has to be
passed via prop. It also accepts an animation to use for opening & closing.

It emits a `click:body` event when any part out of the content is clicked, but only if the modal is
open.

```vue
<template>
  <div>
    <button @click="open = true">Open modal</button>
    <BaseModal animation="fadeAndSlide" :open="open" @click:body="open = false">
      <h1>Hello</h1>
      <p>The modal is working</p>
      <button @click="open = false">Close modal</button>
    </BaseModal>
  </div>
</template>

<script>
  import { BaseModal, FadeAndSlide } from '@empathy/x-components';
  import Vue from 'vue';

  Vue.component('fadeAndSlide', FadeAndSlide);

  export default {
    components: {
      BaseModal
    },
    data() {
      return {
        open: false
      };
    }
  };
</script>
```
</docs>
