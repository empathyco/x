<template>
  <div class="x-progress-bar">
    <div class="x-progress-bar__fill" :style="{ width: width }"></div>
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
    @Prop({ default: 10000 })
    public duration!: number;

    @Prop({ default: 25 })
    public step!: number;

    protected value = 0;

    protected intervalID!: number;

    mounted(): void {
      this.intervalID = setInterval(() => {
        this.calculateWidth();
      }, this.duration / this.step);
    }

    /**
     * Calculates the width of the progress bar.
     *
     * @internal
     */
    protected calculateWidth(): void {
      this.value += this.step;
      if (this.value === 100) {
        clearInterval(this.intervalID);
      }
    }

    /**
     * Represents the width of the progress bar.
     *
     * @returns Percentage - & of the progress bar.
     *
     * @internal
     */
    protected get width(): string {
      return `${this.value}%`;
    }

    @XOn('UserClickedAbortARedirection')
    stop(): void {
      clearInterval(this.intervalID);
    }
  }
</script>

<style lang="scss">
  .x-progress-bar {
    border: 1px solid black;
    height: 10px;
    &__fill {
      height: 100%;
      background: red;
      transition: width 0.25s ease-in-out;
    }
  }
</style>

<docs lang="mdx"></docs>
