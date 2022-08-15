<script lang="ts">
  import Vue, { VNode, CreateElement } from 'vue';
  import { Component, Prop, Provide } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';

  @Component
  export default class ResultProvider extends Vue {
    @Prop({
      required: true
    })
    public result!: Result;

    @Provide('setResultVariant')
    setResultVariant(level: number, variantIndex: number): void {
      if (this.selectedIndexes[level] === variantIndex) {
        return;
      }
      this.selectedIndexes = this.selectedIndexes.slice(0, level);
      this.$set(this.selectedIndexes, level, variantIndex);
    }

    protected selectedIndexes: number[] = [];

    render(createElement: CreateElement): VNode {
      return (
        this.$scopedSlots.default?.({
          result: this.resultToProvide
        })?.[0] ?? createElement()
      );
    }

    public get resultToProvide(): Result {
      if (!this.selectedIndexes) {
        return this.result;
      }
      const mergedResult = this.selectedIndexes.reduce((result, index) => {
        return {
          ...result,
          ...result.variants?.[index]
        };
      }, this.result);
      mergedResult.variants = this.result.variants;
      return mergedResult;
    }
  }
</script>
