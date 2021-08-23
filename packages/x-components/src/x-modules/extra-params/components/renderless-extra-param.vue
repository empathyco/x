<template>
  <NoElement>
    <slot v-bind="{ value, updateValue }"></slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NoElement, State, xComponentMixin } from '../../../components';
  import { Dictionary } from '../../../utils';
  import { ExtraParamsXEvents } from '../events.types';
  import { extraParamsXModule } from '../x-module';

  /**
   * It emits a {@link ExtraParamsXEvents.UserChangedExtraParams} when the `updateValue`
   * is called and the {@link ExtraParamsXEvents.ExtraParamsProvided} when it receives
   * a defaultValue.
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
    /** The name of the extra param.
     *
     * @public
     */
    @Prop({ required: true })
    public extraParamName!: string;

    /** The default value of the extra param.
     *
     * @public
     */
    @Prop()
    public defaultValue?: string;

    /** A dictionary with the extra params from the store.
     *
     * @public
     */
    @State('extraParams', 'params')
    public extraParams!: Dictionary<unknown>;

    /**
     * Emits the {@link ExtraParamsXEvents.ExtraParamsProvided} when the component
     * is mounted if the defaultValue is set.
     *
     * @internal
     */
    created(): void {
      if (this.defaultValue !== undefined /* && this.value === undefined */) {
        this.emitEvent('ExtraParamsProvided', this.defaultValue);
      }
    }

    /** It returns the value of the extra param from the store.
     *
     * @returns Unknown - The value from the store.
     *
     * @internal
     */
    protected get value(): unknown {
      return this.extraParams[this.extraParamName];
    }

    /** It sets the new value to the store.
     *
     * @param newValue - The new value of the extra param.
     *
     * @internal
     */
    protected updateValue(newValue: string): void {
      this.emitEvent('UserChangedExtraParams', newValue);
    }

    /** It emits an {@link ExtraParamsXEvents| event} the passed as payload.
     *
     * @param event - The name of the event.
     * @param value - The value of the extra param.
     *
     * @internal
     */
    protected emitEvent(event: keyof ExtraParamsXEvents, value: unknown): void {
      this.$x.emit(event, { [this.extraParamName]: value });
    }
  }
</script>
