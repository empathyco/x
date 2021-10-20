<template>
  <div class="x-progress-bar">
    <div class="x-progress-bar__fill" :style="cssStyles"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin, XOn } from '../../../components';
  import { searchXModule } from '../x-module';

  /**
   * A progress bar component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class ProgressBar extends Vue {
    @Prop({ default: 2 })
    public duration!: number;

    protected get cssStyles(): any {
      return this.duration === 0 ? { display: 'none' } : { animationDuration: `${this.duration}s` };
    }

    @XOn('UserClickedAbortARedirection')
    stop(): void {
      this.duration = 0;
    }
  }
</script>

<style lang="scss">
  .x-progress-bar {
    height: 10px;
    display: flex;
    &__fill {
      border-radius: 10px;
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
