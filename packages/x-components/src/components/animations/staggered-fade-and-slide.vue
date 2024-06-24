<template>
  <!-- eslint-disable vue/attributes-order -->
  <TransitionGroup
    v-bind="$attrs"
    v-on="$listeners"
    @enter="enter"
    @after-enter="afterEnter"
    :appear="appear"
    :name="name"
    :tag="tag"
  >
    <slot />
  </TransitionGroup>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  // import { useDisableAnimation } from './use-disable-animation';

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with an staggered fade and slide animation.
   *
   * @public
   */
  export default defineComponent({
    name: 'StaggeredFadeAndSlide',
    inheritAttrs: false,
    props: {
      /**
       * Indicates if the transition must be applied on the initial render of the node.
       */
      appear: {
        type: Boolean,
        default: true
      },
      /**
       * The tag of the node to render to the DOM.
       */
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * The time in ms to stagger each item.
       */
      stagger: {
        type: Number,
        default: 25
      }
    },
    setup(props) {
      /**
       * The duration of the transition in ms.
       */
      const transitionDuration = 250;
      /**
       * The counter to keep track of the staggered delay.
       */
      const staggerCounter = ref(0);
      /**
       * The counter to keep track of the animations.
       */
      const animationList = ref<HTMLElement[]>([]);
      /**
       * The name of the animation.
       */
      const animationName = ref('x-staggered-fade-and-slide');
      /**
       * The name of the animation.
       */
      const name = animationName.value;

      /**
       * Calculate the delay for the next element.
       *
       * @returns The delay in ms.
       */
      function getNextTransitionDelay(): number {
        return staggerCounter.value++ * props.stagger;
      }

      /**
       * The enter transition.
       *
       * @param el
       * @param done
       */
      function enter(el: HTMLElement, done: () => void) {
        animationList.value.push(el);
        const delay = getNextTransitionDelay();
        el.style.transitionDelay = `${delay}ms`;
        setTimeout(() => {
          el.style.transitionDelay = '0ms';
          done();
        }, transitionDuration + delay);
      }

      /**
       * The after enter transition.
       *
       * @param el
       */
      function afterEnter(el: HTMLElement) {
        animationList.value = animationList.value.filter(item => item !== el);
        if (animationList.value.length === 0) {
          staggerCounter.value = 0;
        }
      }

      return {
        name,
        enter,
        afterEnter
      };
    }
  });
</script>

<style lang="scss">
  $transition-duration: 0.25s;
  /* 1. Declare transitions */
  .x-staggered-fade-and-slide-enter-active,
  .x-staggered-fade-and-slide-leave-active {
    transition: $transition-duration ease-out;
    transition-property: opacity, transform;
  }

  .x-staggered-fade-and-slide-move {
    transition: transform $transition-duration ease-out;
  }

  /* 2. declare enter from and leave to state */
  .x-staggered-fade-and-slide-enter,
  .x-staggered-fade-and-slide-enter-from,
  .x-staggered-fade-and-slide-leave-to {
    opacity: 0;
    transform: translate3d(0, 50%, 0);
  }

  /* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
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
  <li>Element to animate</li>
  <li>Element to animate</li>
  <li>Element to animate</li>
</StaggeredFadeAndSlide>
```
</docs>
