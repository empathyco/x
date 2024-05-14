<template>
  <!-- eslint-disable vue/attributes-order -->
  <staggering-transition-group
    v-bind="$attrs"
    v-on="$listeners"
    class="x-staggered-fade-and-slide"
    :name="name"
    :appear="appear"
  >
    <!-- eslint-enable -->
    <!-- @slot (Required) Transition-group content -->
    <slot />
  </staggering-transition-group>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StaggeringTransitionGroup from './staggering-transition-group.vue';
  import { useDisableAnimation } from './use-disable-animation';

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with a staggered fade and slide animation.
   *
   * @public
   */
  export default defineComponent({
    name: 'StaggeredFadeAndSlide',
    components: { StaggeringTransitionGroup },
    inheritAttrs: false,
    props: {
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
      const animationName = 'x-staggered-fade-and-slide-';

      const { name } = useDisableAnimation(animationName);

      return {
        name
      };
    }
  });
</script>

<style lang="scss" scoped>
  $transition-duration: 0.25s;

  .x-staggered-fade-and-slide {
    z-index: 0;

    &::v-deep .x-staggered-fade-and-slide {
      &--enter-active,
      &--leave-active {
        transition: $transition-duration ease-out;
        transition-property: opacity, transform;
      }

      &--move {
        transition: transform $transition-duration ease-out;
      }

      &--enter,
      &--leave-to {
        transform: translate3d(0, 50%, 0);
        opacity: 0;
        z-index: -1;
      }
    }
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
