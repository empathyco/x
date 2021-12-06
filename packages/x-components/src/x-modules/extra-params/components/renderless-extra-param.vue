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
    /**
     * The extra param's name.
     *
     * @public
     */
    @Prop({ required: true })
    public name!: string;

    /**
     * A dictionary with the extra params in the store state.
     *
     * @public
     */
    @State('extraParams', 'params')
    public stateParams!: Dictionary<unknown>;

    /**
     * It returns the value of the extra param from the store.
     *
     * @returns - The value from the store.
     *
     * @internal
     */
    protected get value(): unknown {
      return this.stateParams[this.name];
    }

    /**
     * It sets the new value to the store.
     *
     * @param newValue - The new value of the extra param.
     *
     * @internal
     */
    protected updateValue(newValue: unknown): void {
      this.$x.emit('UserChangedExtraParams', { [this.name]: newValue });
    }
  }
</script>

<docs lang="mdx">
## Examples

Renders default slot content. It binds to the default slot the name of the extra parameter and the
default value of it.

### Basic usage

```vue
<template>
  <RenderlessExtraParam #default="{ value, updateValue }" name="store">
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
    props: ['name'],
    data() {
      return {
        items: ['spain', 'portugal']
      };
    }
  };
</script>
```
</docs>
