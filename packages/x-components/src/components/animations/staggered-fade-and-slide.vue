<template>
  <TransitionGroup
    @enter="onEnter"
    @afterEnter="onAfterEnter"
    :appear="appear"
    :name="name"
    :tag="tag"
  >
    <slot />
  </TransitionGroup>
</template>

<script lang="ts">
  import { defineComponent, onUpdated } from 'vue';
  import { useDisableAnimation } from './use-disable-animation';

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
        default: true
      },
      /** The tag of the node to render to the DOM. */
      tag: {
        type: String,
        default: 'div'
      },
      /** The time in ms to stagger each item. */
      stagger: {
        type: Number,
        default: 25
      }
    },
    setup(props) {
      /** The duration of the transition in ms. */
      const transitionDuration = 250;
      /** Indicates if there are new elements to animate. */
      let isNewSet = true;
      /** The new elements to animate. */
      let elementsToAnimate: Element[] = [];
      /** The name of the animation. */
      const { name } = useDisableAnimation('x-staggered-fade-and-slide');

      /**
       * When the component is updated, we are considering that
       * a new set of elements is being inserted, so we need
       * to refresh the elements to animate.
       */
      onUpdated(() => {
        isNewSet = true;
      });

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
          refreshElementsToAnimate(el);
        }

        const elIndex = elementsToAnimate.indexOf(el);
        const staggerDelay = elIndex > 0 ? elIndex * props.stagger : 0;

        (el as HTMLElement).style.transitionDelay = `${staggerDelay}ms`;
        setTimeout(done, transitionDuration + staggerDelay);
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
          c => (c as HTMLElement).style.transitionDelay !== '0ms'
        );
        isNewSet = false;
      }

      /**
       * Listener called when the enter transition has finished.
       * This resets the `transitionDelay`.
       *
       * @param el - Element inserted.
       */
      function onAfterEnter(el: Element) {
        (el as HTMLElement).style.transitionDelay = '0ms';
      }

      return {
        name,
        onEnter,
        onAfterEnter
      };
    }
  });
</script>

<style lang="css">
  /* 1. Declare transitions */
  .x-staggered-fade-and-slide-enter-active,
  .x-staggered-fade-and-slide-leave-active {
    transition: 250ms ease-out;
    transition-property: opacity, transform;
  }

  .x-staggered-fade-and-slide-move {
    transition: transform 250ms ease-out;
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
The Staggered fade and slide components works as the normal fade and slide components, but it also
adds a configurable delay to each transition.

## Example

### Used with animatable components

```vue
<AnimatableComponent :animation="StaggeredFadeAndSlide" />
```

### Used as a regular component:

This components exposes all the props and events of the Staggering transition group, like the `tag`
or the `stagger` props:

```vue
<StaggeredFadeAndSlide tag="ul" :stagger="50">
  <li key="1">Element to animate</li>
  <li key="2">Element to animate</li>
  <li key="3">Element to animate</li>
</StaggeredFadeAndSlide>
```
</docs>
