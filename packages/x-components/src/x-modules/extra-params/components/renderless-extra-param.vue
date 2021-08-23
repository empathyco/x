<template>
  <NoElement>
    <slot v-bind="{ value, updateValue }"></slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
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
    /** The extra param's name.
     *
     * @public
     */
    @Prop({ required: true })
    public extraParamName!: string;

    /** The extra param's default value.
     *
     * @public
     */
    @Prop()
    public defaultValue?: unknown;

    @Watch('defaultValue')
    syncUpdateValue(newValue: unknown): void {
      if (this.defaultValue !== undefined && this.value === undefined) {
        this.emitEvent('ExtraParamsProvided', newValue);
      }
    }

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
      if (this.defaultValue !== undefined && this.value === undefined) {
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

    /** It emits an {@link ExtraParamsXEvents| event} passed as payload.
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

<docs lang="mdx">
## Extending the component

_See how this component has a slot which allow us to extend the default behaviour._

```vue
<template>
  <RenderlessExtraParam name="warehouse" default="" #default="{ value, updateValue }">
    <BaseDropdown :value="value" :items="[1234, 4567]" @change="updateValue" />
  </RenderlessExtraParam>
</template>

<script>
  import { RenderlessExtraParams } from '@empathyco/x-components/extra-params';
  import { BaseDropdown } from '@empathyco/x-components';

  export default {
    name: 'RenderlessExtraParamsDemo',
    components: {
      RenderlessExtraParams,
      BaseDropdown
    }
  };
</script>
```
</docs>
