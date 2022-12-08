<template>
  <staggering-transition-group
    v-on="$listeners"
    class="x-staggered-fade-and-slide"
    :name="name"
    v-bind="$attrs"
    :appear="appear"
  >
    <!-- @slot (Required) Transition-group content -->
    <slot />
  </staggering-transition-group>
</template>

<script lang="ts">
  import { mixins } from 'vue-class-component';
  import { Component, Prop } from 'vue-property-decorator';
  import StaggeringTransitionGroup from '../animations/staggering-transition-group.vue';
  import DisableAnimationMixin from './disable-animation.mixin';

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with an staggered fade and slide animation.
   *
   * @public
   */
  @Component({
    components: { StaggeringTransitionGroup },
    inheritAttrs: false
  })
  export default class StaggeredFadeAndSlide extends mixins(DisableAnimationMixin) {
    /**
     * Indicates if the transition must be applied on the initial render of the node.
     */
    @Prop({
      type: Boolean,
      default: true
    })
    public appear!: boolean;
    /**
     * The name of the animation.
     *
     * @public
     */
    protected animationName = 'x-staggered-fade-and-slide-';
  }
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
  <li>Element to animate</li>
  <li>Element to animate</li>
  <li>Element to animate</li>
</StaggeredFadeAndSlide>
```
</docs>
