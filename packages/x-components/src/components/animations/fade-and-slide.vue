<template>
  <transition-group
    v-on="$listeners"
    class="x-fade-and-slide"
    appear
    :name="name"
    :tag="tag"
    v-bind="$attrs"
  >
    <!-- @slot (Required) Transition-group content -->
    <slot />
  </transition-group>
</template>

<script lang="ts">
  import { mixins } from 'vue-class-component';
  import { Prop, Component } from 'vue-property-decorator';
  import DisableAnimationMixin from './disable-animation.mixin';

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with a fade and slide animation.
   *
   * @public
   */
  @Component({
    inheritAttrs: false
  })
  export default class FadeAndSlide extends mixins(DisableAnimationMixin) {
    /**
     * The name of the animation.
     *
     * @public
     */
    protected animationName = 'x-fade-and-slide-';

    /**
     * HTML Element that the transition-group children will be wrapped in.
     *
     * @public
     */
    @Prop()
    protected tag!: string;
  }
</script>

<style lang="scss" scoped>
  $transition-opacity-duration: 0.2s;
  $transition-transform-duration: 0.3s;

  .x-fade-and-slide::v-deep .x-fade-and-slide {
    &--move,
    &--enter-active,
    &--leave-active {
      transition: opacity $transition-opacity-duration ease-out,
        transform $transition-transform-duration ease-out;
    }

    &--enter,
    &--leave-to {
      transform: translate(-20%, 0);
      opacity: 0;
    }

    &--leave-active {
      position: absolute;
    }
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
