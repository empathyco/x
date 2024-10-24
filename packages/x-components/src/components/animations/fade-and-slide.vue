<template>
  <transition-group class="x-fade-and-slide" :name="name" :tag="tag" :appear="appear">
    <!-- @slot (Required) Transition-group content -->
    <slot />
  </transition-group>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useDisableAnimation } from './use-disable-animation';

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with a fade and slide animation.
   *
   * @public
   */
  export default defineComponent({
    name: 'FadeAndSlide',
    props: {
      /**
       * HTML Element that the transition-group children will be wrapped in.
       */
      tag: String,
      /**
       * Indicates if the transition must be applied on the initial render of the node.
       */
      appear: {
        type: Boolean,
        default: true
      }
    },
    setup: function () {
      /**
       * The name of the animation.
       */
      const animationName = 'x-fade-and-slide-';

      const { name } = useDisableAnimation(animationName);

      return { name };
    }
  });
</script>

<style lang="css">
  .x-fade-and-slide--move,
  .x-fade-and-slide--enter-active,
  .x-fade-and-slide--leave-active {
    transition: opacity 0.2s ease-out, transform 0.3s ease-out;
  }

  .x-fade-and-slide--enter-from,
  .x-fade-and-slide--leave-to {
    transform: translate(-20%, 0);
    opacity: 0;
  }

  .x-fade-and-slide--leave-active {
    position: absolute;
  }
</style>

<docs lang="mdx">
## Examples

The FadeAndSlide component is intended to be used as a prop in animatable components but also works
as a wrapper of a transition group that can receive the tag it will render to as a prop.

Used as a prop in an animatable component:

```vue
<AnimatableComponent :animation="FadeAndSlide" />
```

Used as a regular component passing a the tag as prop:

```vue
<FadeAndSlide tag="ul">
  <li>Element to animate</li>
  <li>Element to animate</li>
  <li>Element to animate</li>
</FadeAndSlide>
```
</docs>
