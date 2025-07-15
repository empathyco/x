<template>
  <div v-show="isWaitingForLeave || open" ref="modalRef" class="x-modal" data-test="modal">
    <component
      :is="animation"
      @before-leave="isWaitingForLeave = true"
      @after-leave="isWaitingForLeave = false"
    >
      <div
        v-if="open"
        ref="modalContentRef"
        class="x-modal__content"
        data-test="modal-content"
        role="dialog"
        :class="contentClass"
        aria-label="Base modal content"
      >
        <!-- @slot (Required) Modal container content -->
        <slot />
      </div>
    </component>
    <component :is="overlayAnimation">
      <div
        v-if="open"
        class="x-modal__overlay"
        :class="overlayClass"
        data-test="modal-overlay"
        @click="emitOverlayClicked"
        @keydown="emitOverlayClicked"
      />
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDebounce } from '../../composables'
import { AnimationProp } from '../../types'
import { FOCUSABLE_SELECTORS, getTargetElement } from '../../utils'
import { Fade, NoAnimation } from '../animations'

/**
 * Base component with no XPlugin dependencies that serves as a utility for constructing more
 * complex modals.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseModal',
  props: {
    /** Determines if the modal is open or not. */
    open: {
      type: Boolean,
      required: true,
    },
    /**
     * Determines if the focused element changes to one inside the modal when it opens. Either the
     * first element with a positive tabindex or just the first focusable element.
     */
    focusOnOpen: {
      type: Boolean,
      default: true,
    },
    /**
     * The reference selector of a DOM element to use as reference to position the modal.
     * This selector can be an ID or a class, if it is a class, it will use the first
     * element that matches.
     */
    referenceSelector: String,
    /** Animation to use for opening/closing the modal.This animation only affects the content. */
    animation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /**
     * Animation to use for the overlay (backdrop) part of the modal. By default, it uses
     * a fade transition.
     */
    overlayAnimation: {
      type: AnimationProp,
      default: () => Fade,
    },
    /** Class inherited by content element. */
    contentClass: String,
    /** Class inherited by overlay element. */
    overlayClass: String,
  },
  emits: ['click:overlay', 'focusin:body'],
  setup(props, { emit }) {
    /** Reference to the modal element in the DOM. */
    const modalRef = ref<HTMLDivElement>()
    /** Reference to the modal content element in the DOM. */
    const modalContentRef = ref<HTMLDivElement>()

    /** The previous value of the body overflow style. */
    const previousBodyOverflow = ref('')
    /** The previous value of the HTML element overflow style. */
    const previousHTMLOverflow = ref('')
    /** Boolean to delay the leave animation until it has completed. */
    const isWaitingForLeave = ref(false)
    /** The reference element to use to find the modal's position. */
    let referenceElement: HTMLElement | undefined

    /** Disables the scroll of both the body and the window. */
    function disableScroll() {
      previousBodyOverflow.value = document.body.style.overflow
      previousHTMLOverflow.value = document.documentElement.style.overflow
      document.body.style.overflow = document.documentElement.style.overflow = 'hidden'
    }

    /** Restores the scroll of both the body and the window. */
    function enableScroll() {
      document.body.style.overflow = previousBodyOverflow.value
      document.documentElement.style.overflow = previousHTMLOverflow.value
    }

    /**
     * Emits the `click:overlay` event if the click has been triggered in the overlay layer.
     *
     * @param event - The click event.
     */
    function emitOverlayClicked(event: Event) {
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('click:overlay', event)
    }

    /**
     * Emits the `focusin:body` event if a focus event has been triggered outside the modal.
     *
     * @param event - The focusin event.
     */
    function emitFocusInBody(event: FocusEvent) {
      if (!modalContentRef.value?.contains(getTargetElement(event))) {
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('focusin:body', event)
      }
    }

    /**
     * Adds listeners to the body element ot detect if the modal should be closed.
     *
     * @remarks TODO find a better solution and remove the timeout
     * To avoid emit the focusin on opening X that provokes closing it immediately.
     * This is because this event was emitted after the open of main modal when the user clicks
     * on the customer website search box (focus event). This way we avoid add the listener before
     * the open and the avoid the event that provokes the close.
     */
    function addBodyListeners() {
      setTimeout(() => {
        document.body.addEventListener('focusin', emitFocusInBody)
      })
    }

    /** Removes the body listeners. */
    function removeBodyListeners() {
      document.body.removeEventListener('focusin', emitFocusInBody)
    }

    /**
     * Sets the focused element to the first element either the first element with a positive
     * tabindex or, if there isn't any, the first focusable element inside the modal.
     */
    function setFocus() {
      const candidates: HTMLElement[] = Array.from(
        modalContentRef.value?.querySelectorAll(FOCUSABLE_SELECTORS) ?? [],
      )
      const element = candidates.find(element => element.tabIndex) ?? candidates[0]
      element?.focus()
    }

    /**
     * Syncs the body to the open state of the modal, adding or removing styles and listeners.
     *
     * @remarks nextTick() to wait for `modalContentRef` to be updated to look for focusable
     * candidates inside.
     *
     * @param isOpen - True when the modal is opened.
     */
    async function syncBody(isOpen: boolean) {
      if (isOpen) {
        disableScroll()
        addBodyListeners()
        if (props.focusOnOpen) {
          await nextTick()
          setFocus()
        }
      } else {
        enableScroll()
        removeBodyListeners()
      }
    }

    /**
     * Updates the position of the modal setting the top of the element depending
     * on the selector. The modal will be placed under this selector.
     */
    const debouncedUpdatePosition = useDebounce(
      () => {
        const { height, y } = referenceElement?.getBoundingClientRect() ?? { height: 0, y: 0 }
        modalRef.value!.style.top = `${height + y}px`
        modalRef.value!.style.bottom = '0'
        modalRef.value!.style.height = 'auto'
      },
      100,
      { leading: true },
    )

    let resizeObserver: ResizeObserver

    onMounted(() => {
      watch(() => props.open, syncBody)
      if (props.open) {
        syncBody(true)
      }

      resizeObserver = new ResizeObserver(debouncedUpdatePosition)

      watch(
        () => props.referenceSelector,
        () => {
          resizeObserver.disconnect()

          if (props.referenceSelector) {
            const element = document.querySelector(props.referenceSelector) as HTMLElement
            if (element) {
              referenceElement = element
              resizeObserver.observe(element)
            }
          } else {
            referenceElement = undefined
            debouncedUpdatePosition()
          }
        },
        { immediate: true },
      )
    })

    onBeforeUnmount(() => {
      if (props.open) {
        removeBodyListeners()
        enableScroll()
      }
      resizeObserver.disconnect()
    })

    return {
      emitOverlayClicked,
      isWaitingForLeave,
      modalContentRef,
      modalRef,
    }
  },
})
</script>

<style lang="css" scoped>
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
}

.x-modal__content {
  display: flex;
  flex-flow: column nowrap;
  z-index: 1;
}

.x-modal__overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(0, 0, 0);
  opacity: 0.3;
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
import { BaseModal, FadeAndSlide } from '@empathyco/x-components'
import Vue from 'vue'

Vue.component('fadeAndSlide', FadeAndSlide)

export default {
  components: {
    BaseModal,
  },
  data() {
    return {
      open: false,
    }
  },
}
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
import { BaseModal, FadeAndSlide } from '@empathyco/x-components'
import Vue from 'vue'

Vue.component('fadeAndSlide', FadeAndSlide)

export default {
  components: {
    BaseModal,
  },
  data() {
    return {
      open: false,
    }
  },
}
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
import { BaseModal, FadeAndSlide } from '@empathyco/x-components'
import Vue from 'vue'

Vue.component('fadeAndSlide', FadeAndSlide)

export default {
  components: {
    BaseModal,
  },
  data() {
    return {
      open: false,
    }
  },
}
</script>
```

## Vue Events

A list of events that the component will emit:

- `click:overlay`: the event is emitted after the user clicks any part out of the content but only
  if the modal is open. The event payload is the mouse event that triggers it.
- `focusin:body`: the event is emitted after the user focus in any part out of the content but only
  if the modal is open. The event payload is the focus event that triggers it.
</docs>
