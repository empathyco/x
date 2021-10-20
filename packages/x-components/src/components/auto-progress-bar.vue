<template>
  <div class="x-progress-bar">
    <div class="x-progress-bar__fill" :style="cssStyles"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XOn } from './decorators/bus.decorators';

  /**
   * A progress bar component.
   *
   * @public
   */
  @Component
  export default class AutoProgressBar extends Vue {
    /**
     * The duration in seconds of the progress bar.
     *
     * @public
     */
    @Prop({ default: 2 })
    public duration!: number;

    /**
     * Auxiliary prop to stop the animation.
     *
     * @internal
     */
    protected isActive = true;

    /**
     * Auxiliary method which calculates the styles of the animation.
     *
     * @returns The animation CSS styles.
     *
     * @internal
     */
    protected get cssStyles(): Partial<CSSStyleDeclaration> {
      return this.isActive
        ? { animationDuration: `${this.duration}s` }
        : { animationIterationCount: '1' };
    }

    /**
     * Listens the UserClickedAbortARedirection event and aborts the animation.
     *
     * {@link XEventsTypes.UserClickedAbortARedirection}.
     *
     */
    @XOn('UserClickedAbortARedirection')
    abortsAnimation(): void {
      this.isActive = false;
    }
  }
</script>

<style lang="scss">
  .x-progress-bar {
    height: 10px;
    display: flex;
    &__fill {
      flex: 1 0 auto;
      background: black;
      animation-name: slide;
      animation-timing-function: ease-in;
    }
  }
  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0%);
    }
  }
</style>

<docs lang="mdx"></docs>
