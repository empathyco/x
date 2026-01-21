<template>
  <TransitionGroup
    :appear="appear"
    :name="name"
    :tag="tag"
    @enter="onEnter"
    @after-enter="onAfterEnter"
  >
    <slot />
  </TransitionGroup>
</template>

<script lang="ts">
import { defineComponent, onUpdated } from 'vue'
import { useDisableAnimation } from './use-disable-animation'

/**
 * Renders a transition group wrapping the elements passed in the default slot and animating
 * them with a staggered fade and slide animation.
 *
 * @public
 */
export default defineComponent({
  name: 'StaggeredFadeAndSlide',
  props: {
    /** Indicates if the transition must be applied on the initial render of the node. */
    appear: {
      type: Boolean,
      default: true,
    },
    /** The tag of the node to render to the DOM. */
    tag: {
      type: String,
      default: 'div',
    },
    /** The time in ms to stagger each item. */
    stagger: {
      type: Number,
      default: 25,
    },
  },
  setup(props) {
    /** The duration of the transition in ms. */
    const transitionDuration = 250
    /** Indicates if there are new elements to animate. */
    let isNewSet = true
    /** The new elements to animate. */
    let elementsToAnimate: Element[] = []
    /** The name of the animation. */
    const { name } = useDisableAnimation('x-staggered-fade-and-slide')

    /**
     * When the component is updated, we are considering that
     * a new set of elements is being inserted, so we need
     * to refresh the elements to animate.
     */
    onUpdated(() => {
      isNewSet = true
    })

    /**
     * Listener called when one frame the element is inserted.
     * This calculates the stagger delay to be used as `transitionDelay` and finally resolve
     * the transition end after the CSS transition duration plus stagger delay.
     *
     * @param el - Element inserted.
     * @param done - Callback to indicate the transition end.
     */
    function onEnter(el: Element, done: () => void) {
      if (isNewSet) {
        refreshElementsToAnimate(el)
      }

      const elIndex = elementsToAnimate.indexOf(el)
      const staggerDelay = elIndex > 0 ? elIndex * props.stagger : 0

      ;(el as HTMLElement).style.transitionDelay = `${staggerDelay}ms`
      setTimeout(done, transitionDuration + staggerDelay)
    }

    /**
     * Finds he parent's children subset of new elements entering the DOM.
     * This is achieved by filtering out the elements that are already animated.
     * Those with 'transition-delay' equal to '0ms' are considered already animated.
     *
     * Also marks isNewSet as false as the elements are already updated.
     *
     * @param el - Current element.
     */
    function refreshElementsToAnimate(el: Element) {
      elementsToAnimate = [...el.parentElement!.children].filter(
        c => (c as HTMLElement).style.transitionDelay !== '0ms',
      )
      isNewSet = false
    }

    /**
     * Listener called when the enter transition has finished.
     * This resets the `transitionDelay`.
     *
     * @param el - Element inserted.
     */
    function onAfterEnter(el: Element) {
      ;(el as HTMLElement).style.transitionDelay = '0ms'
    }

    return {
      name,
      onEnter,
      onAfterEnter,
      transitionDurationInMs: `${transitionDuration}ms`,
    }
  },
})
</script>

<style lang="css">
/* 1. Declare transitions */
.x-staggered-fade-and-slide-enter-active,
.x-staggered-fade-and-slide-leave-active {
  transition: v-bind(transitionDurationInMs) ease-out;
  transition-property: opacity, transform;
}

.x-staggered-fade-and-slide-move {
  transition: transform v-bind(transitionDurationInMs) ease-out;
}

/* 2. Declare enter, from and leave to state */
.x-staggered-fade-and-slide-enter,
.x-staggered-fade-and-slide-enter-from,
.x-staggered-fade-and-slide-leave-to {
  opacity: 0;
  transform: translate3d(0, 50%, 0);
}

/* 3. Ensure leaving items are taken out of layout flow so that moving animations can be
        calculated correctly. */
.x-staggered-fade-and-slide-leave-active {
  position: absolute;
}
</style>

<docs lang="mdx">
## Examples

The StaggeredFadeAndSlide component works like the normal fade and slide components, but adds a configurable delay to each transition.

### Used with animatable components

```vue
<template>
  <AnimatableComponent :animation="StaggeredFadeAndSlide" />
</template>

<script setup>
import StaggeredFadeAndSlide from '@empathyco/x-components/js/components/animations/staggered-fade-and-slide.vue'
</script>
```

### Used as a regular component

This component exposes all the props and events of the transition group, like the `tag` or the `stagger` props:

```vue
<template>
  <StaggeredFadeAndSlide tag="ul" :stagger="50">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </StaggeredFadeAndSlide>
  <button @click="addItem">Add Item</button>
</template>

<script setup>
import { ref } from 'vue'
import StaggeredFadeAndSlide from '@empathyco/x-components/js/components/animations/staggered-fade-and-slide.vue'

const items = ref(['One', 'Two', 'Three'])
function addItem() {
  items.value.push(`Item ${items.value.length + 1}`)
}
</script>
```
</docs>
