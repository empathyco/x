<template>
  <component :is="animation">
    <div v-if="open" class="x-modal" data-test="modal">
      <div ref="modal" class="x-modal__content" data-test="modal-content" role="dialog">
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

    /** The previous value of the body overflow style. */
    protected previousBodyOverflow = '';
    /** The previous value of the HTML element overflow style. */
    protected previousHTMLOverflow = '';

    public $refs!: {
      modal: HTMLElement;
    };

    protected mounted(): void {
      /* Watcher added after mount to prevent SSR from breaking */
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.$watch('open', this.syncBody, { immediate: true });
    }

    /**
     * Syncs the body to the open state of the modal, adding or removing styles and listeners.
     *
     * @param isOpen - True when the modal is opened.
     * @internal
     */
    protected syncBody(isOpen: boolean): void {
      if (isOpen) {
        this.disableScroll();
        this.addBodyListeners();
        /* eslint-disable @typescript-eslint/unbound-method */
        this.$on('hook:beforeDestroy', this.removeBodyListeners);
        this.$on('hook:beforeDestroy', this.enableScroll);
        /* eslint-enable @typescript-eslint/unbound-method */
      } else {
        this.enableScroll();
        this.removeBodyListeners();
        /* eslint-disable @typescript-eslint/unbound-method */
        this.$off('hook:beforeDestroy', this.removeBodyListeners);
        this.$off('hook:beforeDestroy', this.enableScroll);
        /* eslint-enable @typescript-eslint/unbound-method */
      }
    }

    /**
     * Disables the scroll of both the body and the window.
     *
     * @internal
     */
    protected disableScroll(): void {
      this.previousBodyOverflow = document.body.style.overflow;
      this.previousHTMLOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = document.documentElement.style.overflow = 'hidden';
    }

    /**
     * Restores the scroll of both the body and the window.
     *
     * @internal
     */
    protected enableScroll(): void {
      document.body.style.overflow = this.previousBodyOverflow;
      document.documentElement.style.overflow = this.previousHTMLOverflow;
      document.body.style.overflow = document.documentElement.style.overflow = '';
    }

    /**
     * Adds listeners to the body element ot detect if the modal should be closed.
     *
     * @internal
     */
    protected addBodyListeners(): void {
      /* eslint-disable @typescript-eslint/unbound-method */
      document.body.addEventListener('click', this.emitClickInBody);
      document.body.addEventListener('focusin', this.emitFocusInBody);
      /* eslint-enable @typescript-eslint/unbound-method */
    }

    /**
     * Removes the body listeners.
     *
     * @internal
     */
    protected removeBodyListeners(): void {
      /* eslint-disable @typescript-eslint/unbound-method */
      document.body.removeEventListener('click', this.emitClickInBody);
      document.body.removeEventListener('focusin', this.emitFocusInBody);
      /* eslint-enable @typescript-eslint/unbound-method */
    }

    /**
     * Emits the `click:body` event if the click has been triggered out of the modal.
     *
     * @param event - The click event.
     * @internal
     */
    protected emitClickInBody(event: MouseEvent): void {
      if (!this.$refs.modal.contains(event.target as HTMLElement)) {
        this.$emit('click:body', event);
      }
    }

    /**
     * Emits the `focusin:body` event if the focus event has been triggered out of the modal.
     *
     * @param event - The focusin event.
     * @internal
     */
    protected emitFocusInBody(event: FocusEvent): void {
      if (!this.$refs.modal.contains(event.target as HTMLElement)) {
        this.$emit('focusin:body', event);
      }
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
