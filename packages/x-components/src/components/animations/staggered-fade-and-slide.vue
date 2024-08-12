<template>
  <TransitionGroup
    @enter="onEnter"
    @afterEnter="onAfterEnter"
    @leave="onLeave"
    :appear="appear"
    :name="name"
    :tag="tag"
  >
    <slot />
  </TransitionGroup>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
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

      /** The counter to keep track of the staggered delay. */
      const staggerCounter = ref(0);
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
      function onEnter(el: Element, done: () => void) {
        const elIndex = +((el as HTMLElement).dataset.index ?? 0);
        const staggerIndex = elIndex - staggerCounter.value;
        const staggerDelay = staggerIndex * props.stagger;

        (el as HTMLElement).style.transitionDelay = `${staggerDelay}ms`;
        setTimeout(done, transitionDuration + staggerDelay);
      }

      /**
       * Listener called when the enter transition has finished.
       * This resets the `transitionDelay` and add one to the stagger counter.
       *
       * @param el - Element inserted.
       */
      function onAfterEnter(el: Element) {
        (el as HTMLElement).style.transitionDelay = '0ms';
        staggerCounter.value++;
      }

      /**
       * Listener called when the leave transition starts.
       * This resets the stagger counter to 0 to init the staggered animation.
       *
       * @param _ - Element inserted.
       * @param done - Callback to indicate the transition end.
       */
      function onLeave(_: Element, done: () => void) {
        staggerCounter.value = 0;
        done();
      }

      return {
        name,
        onEnter,
        onAfterEnter,
        onLeave
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
  <li key="1" data-index="0">Element to animate</li>
  <li key="2" data-index="1">Element to animate</li>
  <li key="3" data-index="2">Element to animate</li>
</StaggeredFadeAndSlide>
```
</docs>
