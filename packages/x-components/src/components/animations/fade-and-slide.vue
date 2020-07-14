<template>
  <transition-group v-on="$listeners" appear name="fade-slide" :tag="tag">
    <!-- @slot (Required) Transition-group content -->
    <slot />
  </transition-group>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Prop, Component } from 'vue-property-decorator';

  /**
   * Renders a transition group wrapping the elements passed in the default slot and animating
   * them with a fade and slide animation.
   *
   * @public
   */
  @Component
  export default class FadeAndSlide extends Vue {
    /**
     * HTML Element that the transition-group children will be wrapped in.
     *
     * @public
     */
    @Prop()
    protected tag!: string;
  }
</script>

<style lang="scss">
  $transition-opacity-duration: 0.2s;
  $transition-transform-duration: 0.3s;

  .fade-slide-move,
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity $transition-opacity-duration ease-out,
      transform $transition-transform-duration ease-out;
  }

  .fade-slide-enter,
  .fade-slide-leave-to {
    transform: translate(-20%, 0);
    opacity: 0;
  }

  .fade-slide-leave-active {
    position: absolute;
  }
</style>

<docs>
  #Example

  The FadeAndSlide component is intended to be used as a prop in animatable components but also
  works as a wrapper of a transition group that can receive the tag it will render to as a prop.

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
