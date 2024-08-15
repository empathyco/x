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
  import { defineComponent } from 'vue';
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

      /** The name of the animation. */
      const { name } = useDisableAnimation('x-staggered-fade-and-slide');

      /**
       * Listener called when one frame the element is inserted.
       * This calculates the stagger delay to be used as `transitionDelay` and finally resolve
       * the transition end after the CSS transition duration plus stagger delay.
       *
       * @param el - Element inserted.
       * @param done - Callback to indicate the transition end.
       */
      function onEnter(el: HTMLElement, done: () => void) {
        const elIndex = findAnimationIndex(el);
        const staggerDelay = elIndex > 0 ? elIndex * props.stagger : 0;

        el.style.transitionDelay = `${staggerDelay}ms`;
        setTimeout(done, transitionDuration + staggerDelay);
      }

      /**
       * Finds the index of the element in the parent children subset of new elements entering the DOM.
       * This is achived by filtering out the elements that are already animated,
       * which are those marked with the `data-animated` attribute.
       *
       * @param el - Element to find.
       * @returns The index of the element in the parent children subset of new elements.
       */
      function findAnimationIndex(el: HTMLElement) {
        return [...el.parentElement!.children]
          .filter(c => (c as HTMLElement).dataset.animated !== 'true')
          .indexOf(el);
      }

      /**
       * Listener called when the enter transition has finished.
       * This resets the `transitionDelay` and add mark the element as animated,
       * setting the `data-animated` attribute to `true`.
       *
       * @param el - Element inserted.
       */
      function onAfterEnter(el: HTMLElement) {
        el.style.transitionDelay = '0ms';
        el.dataset.animated = 'true';
      }

      return {
        name,
        onEnter,
        onAfterEnter
      };
    }
  });
</script>

<style lang="scss">
  $transition-duration: 250ms;

  /* 1. Declare transitions */
  .x-staggered-fade-and-slide-enter-active,
  .x-staggered-fade-and-slide-leave-active {
    transition: $transition-duration ease-out;
    transition-property: opacity, transform;
  }

  .x-staggered-fade-and-slide-move {
    transition: transform $transition-duration ease-out;
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
