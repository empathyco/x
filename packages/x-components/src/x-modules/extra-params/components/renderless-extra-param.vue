<template>
  <NoElement>
    <slot v-bind="{ defaultValue, updateValue }"></slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NoElement, xComponentMixin } from '../../../components';
  import { extraParamsXModule } from '../x-module';

  /**
   * It emits a {@link ExtraParamsXEvents.UserChangedExtraParams} when the `updateValue`
   * is called.
   *
   * @public
   */

  @Component({
    mixins: [xComponentMixin(extraParamsXModule)],
    components: {
      NoElement
    }
  })
  export default class RenderlessExtraParam extends Vue {
    @Prop({ required: true })
    protected extraParamName!: string;

    @Prop()
    protected defaultValue?: string;

    protected updateValue(newValue: string): void {
      this.$x.emit('UserChangedExtraParams', { [this.extraParamName]: newValue });
    }
  }
</script>
