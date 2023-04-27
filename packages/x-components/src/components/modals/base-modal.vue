<template>
  <div v-show="isWaitingForLeave || open" ref="modal" class="x-modal" data-test="modal">
    <component
      :is="animation"
      @before-leave="isWaitingForLeave = true"
      @after-leave="isWaitingForLeave = false"
    >
      <div
        v-if="open"
        ref="modalContent"
        class="x-modal__content"
        data-test="modal-content"
        role="dialog"
        :class="contentClass"
      >
        <!-- @slot (Required) Modal container content -->
        <slot />
      </div>
    </component>
    <component :is="overlayAnimation">
      <div
        v-if="open"
        @click="emitOverlayClicked"
        @keydown="emitOverlayClicked"
        class="x-modal__overlay"
        :class="overlayClass"
        data-test="modal-overlay"
      />
    </component>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Mixins } from 'vue-property-decorator';
  import { getTargetElement } from '../../utils/html';
  import Fade from '../animations/fade.vue';
  import { NoElement } from '../no-element';
  import { FOCUSABLE_SELECTORS } from '../../utils/focus';
  import { Debounce } from '../decorators/debounce.decorators';
  import { dynamicPropsMixin } from '../dynamic-props.mixin';

  /**
   * Base component with no XPlugin dependencies that serves as a utility for constructing more
   * complex modals.
   *
   * @public
   */
  @Component
  export default class BaseModal extends Mixins(
    dynamicPropsMixin(['contentClass', 'overlayClass'])
  ) {
    /**
     * Animation to use for opening/closing the modal. This animation only affects the content.
     */
    @Prop({ default: () => NoElement })
    public animation!: Vue | string;

    /**
     * Animation to use for the overlay (backdrop) part of the modal. By default, it uses
     * a fade transition.
     */
    @Prop({ default: () => Fade })
    public overlayAnimation!: Vue | string;

    /**
     * Determines if the modal is open or not.
     */
    @Prop({ required: true })
    public open!: boolean;

    /**
     * Determines if the focused element changes to one inside the modal when it opens. Either the
     * first element with a positive tabindex or just the first focusable element.
     */
    @Prop({ default: true })
    public focusOnOpen!: boolean;

    /**
     * The reference selector of a DOM element to use as reference to position the modal.
     * This selector can be an ID or a class, if it is a class, it will use the first
     * element that matches.
     */
    @Prop()
    public referenceSelector?: string;

    /**
     * The previous value of the body overflow style.
     */
    protected previousBodyOverflow = '';
    /**
     * The previous value of the HTML element overflow style.
     */
    protected previousHTMLOverflow = '';
    /**
     * Boolean to delay the leave animation until it has completed.
     */
    protected isWaitingForLeave = false;
    /**
     * The reference element to use to find the modal's position.
     */
    protected referenceElement!: HTMLElement;

    public $refs!: {
      /**
       * Reference to the modal element in the DOM.
       */
      modal: HTMLDivElement;
      /**
       * Reference to the modal content element in the DOM.
       */
      modalContent: HTMLDivElement;
    };

    protected mounted(): void {
      /* Watcher added after mount to prevent SSR from breaking */
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.$watch('open', this.syncBody);
      if (this.open) {
        this.syncBody(true);
      }

      // eslint-disable-next-line @typescript-eslint/unbound-method
      const resizeObserver = new ResizeObserver(this.updatePosition);

      this.$watch(
        'clientHeaderSelector',
        () => {
          if (this.referenceSelector) {
            const element = document.querySelector(this.referenceSelector) as HTMLElement;
            if (element) {
              this.referenceElement = element;
              resizeObserver.observe(element);
            }
          }
        },
        { immediate: true }
      );

      this.$on('hook:beforeDestroy', () => {
        resizeObserver.disconnect();
      });
    }

    /**
     * Updates the position of the modal setting the top of the element depending
     * on the selector. The modal will be placed under this selector.
     *
     * @internal
     */
    @Debounce(100, { leading: true })
    updatePosition(): void {
      const { height, y } = this.referenceElement?.getBoundingClientRect() ?? { height: 0, y: 0 };
      this.$refs.modal.style.top = `${height + y}px`;
      this.$refs.modal.style.bottom = '0';
      this.$refs.modal.style.height = 'auto';
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
        if (this.focusOnOpen) {
          this.setFocus();
        }
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
    }

    /**
     * Adds listeners to the body element ot detect if the modal should be closed.
     *
     * @internal
     */
    protected addBodyListeners(): void {
      // TODO find a better solution and remove the timeout
      // to avoid emit the focusin on opening X that provokes closing it immediately.
      // This is because this event was emitted after the open of main modal when the user clicks
      // on the customer website search box (focus event). This way we avoid add the listener before
      // the open and the avoid the event that provokes the close.
      setTimeout(() => {
        /* eslint-disable @typescript-eslint/unbound-method */
        document.body.addEventListener('focusin', this.emitFocusInBody);
        /* eslint-enable @typescript-eslint/unbound-method */
      });
    }

    /**
     * Removes the body listeners.
     *
     * @internal
     */
    protected removeBodyListeners(): void {
      /* eslint-disable @typescript-eslint/unbound-method */
      document.body.removeEventListener('focusin', this.emitFocusInBody);
      /* eslint-enable @typescript-eslint/unbound-method */
    }

    /**
     * Emits the `click:overlay` event if the click has been triggered in the overlay layer.
     *
     * @param event - The click event.
     * @internal
     */
    protected emitOverlayClicked(event: MouseEvent): void {
      this.$emit('click:overlay', event);
    }

    /**
     * Emits the `focusin:body` event if a focus event has been triggered outside the modal.
     *
     * @param event - The focusin event.
     * @internal
     */
    protected emitFocusInBody(event: FocusEvent): void {
      if (!this.$refs.modalContent?.contains(getTargetElement(event))) {
        this.$emit('focusin:body', event);
      }
    }

    /**
     * Sets the focused element to the first element either the first element with a positive
     * tabindex or, if there isn't any, the first focusable element inside the modal.
     *
     * @internal
     */
    protected setFocus(): void {
      const focusCandidates: HTMLElement[] = Array.from(
        this.$refs.modalContent.querySelectorAll(FOCUSABLE_SELECTORS)
      );

      const elementToFocus =
        focusCandidates.find(element => element.tabIndex) ?? focusCandidates[0];

      elementToFocus?.focus();
    }
  }
</script>

<style lang="scss" scoped>
  .x-modal {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    z-index: 1;

    &__content {
      display: flex;
      flex-flow: column nowrap;
      z-index: 1;
    }

    &__overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgb(0, 0, 0);
      opacity: 0.3;
    }
  }
</style>

<docs lang="mdx">
## Examples

The `BaseModal` is a simple component that serves to create complex modals. Its open state has to be
passed via prop. There is a prop, `referenceSelector`, used to place the modal under some element
instead of set the top of the element directly. It also accepts an animation to use for opening &
closing.

It emits a `click:overlay` event when any part out of the content is clicked, but only if the modal
is open.

```vue
<template>
  <div>
    <button @click="open = true">Open modal</button>
    <BaseModal
      :animation="fadeAndSlide"
      :open="open"
      @click:overlay="open = false"
      referenceSelector=".header"
    >
      <h1>Hello</h1>
      <p>The modal is working</p>
      <button @click="open = false">Close modal</button>
    </BaseModal>
  </div>
</template>

<script>
  import { BaseModal, FadeAndSlide } from '@empathyco/x-components';
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

### Customized usage

#### Customizing the content with classes

The `contentClass` prop can be used to add classes to the modal content.

```vue
<template>
  <div>
    <button @click="open = true">Open modal</button>
    <BaseModal
      :animation="fadeAndSlide"
      :open="open"
      @click:overlay="open = false"
      referenceSelector=".header"
      contentClass="x-bg-neutral-75"
    >
      <h1>Hello</h1>
      <p>The modal is working</p>
      <button @click="open = false">Close modal</button>
    </BaseModal>
  </div>
</template>

<script>
  import { BaseModal, FadeAndSlide } from '@empathyco/x-components';
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

#### Customizing the overlay with classes

The `overlayClass` prop can be used to add classes to the modal overlay.

```vue
<template>
  <div>
    <button @click="open = true">Open modal</button>
    <BaseModal
      :animation="fadeAndSlide"
      :open="open"
      @click:overlay="open = false"
      referenceSelector=".header"
      overlayClass="x-bg-neutral-75"
    >
      <h1>Hello</h1>
      <p>The modal is working</p>
      <button @click="open = false">Close modal</button>
    </BaseModal>
  </div>
</template>

<script>
  import { BaseModal, FadeAndSlide } from '@empathyco/x-components';
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

## Vue Events

A list of events that the component will emit:

- `click:overlay`: the event is emitted after the user clicks any part out of the content but only
  if the modal is open. The event payload is the mouse event that triggers it.
- `focusin:body`: the event is emitted after the user focus in any part out of the content but only
  if the modal is open. The event payload is the focus event that triggers it.
</docs>
