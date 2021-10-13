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
    /**
     * The extra param's name.
     *
     * @public
     */
    @Prop({ required: true })
    public name!: string;

    /**
     * The extra param's default value.
     *
     * @public
     */
    @Prop()
    public defaultValue?: unknown;

    /**
     * A dictionary with the extra params.
     *
     * @public
     */
    @State('extraParams', 'params')
    public extraParams!: Dictionary<unknown>;

    /**
     * A dictionary with the extra params from the url.
     *
     * @public
     */
    @State('url', 'extraParams')
    public urlExtraParams!: Dictionary<unknown>;

    /**
     * Emits the {@link ExtraParamsXEvents.ExtraParamsProvided} when the component
     * is mounted if the defaultValue is set.
     *
     * @internal
     */
    created(): void {
      this.$watch(
        () => this.defaultValue,
        defaultValue => {
          if (
            defaultValue !== undefined &&
            this.value === undefined &&
            this.urlExtraParams[this.name] === undefined
          ) {
            this.emitEvent('ExtraParamsProvided', this.defaultValue);
          }
        },
        { immediate: true }
      );
    }

    /**
     * It returns the value of the extra param from the store.
     *
     * @returns - The value from the store.
     *
     * @internal
     */
    protected get value(): unknown {
      return this.extraParams[this.name];
    }

    /**
     * It sets the new value to the store.
     *
     * @param newValue - The new value of the extra param.
     *
     * @internal
     */
    protected updateValue(newValue: unknown): void {
      this.emitEvent('UserChangedExtraParams', newValue);
    }

    /**
     * It emits an {@link ExtraParamsXEvents| event} passed as payload.
     *
     * @param event - The name of the event.
     * @param value - The value of the extra param.
     *
     * @internal
     */
    protected emitEvent(event: keyof ExtraParamsXEvents, value: unknown): void {
      this.$x.emit(event, { [this.name]: value });
    }
  }
</script>

<docs lang="mdx">
#Example

Renders default slot content. It binds to the default slot the name of the extra parameter and the
default value of it.

## Basic usage

```vue
<template>
  <RenderlessExtraParam #default="{ value, updateValue }" name="warehouse" defaultValue="1234">
    <BaseDropdown @change="updateValue" :value="value" :items="items" />
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
    },
    props: ['name', 'defaultValue'],
    data() {
      return {
        items: [1234, 4567]
      };
    }
  };
</script>
```
</docs>
