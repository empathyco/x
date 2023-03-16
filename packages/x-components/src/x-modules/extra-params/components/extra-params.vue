<script lang="ts">
  import { Dictionary } from '@empathyco/x-utils';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, xComponentMixin, XEmit } from '../../../components';
  import { extraParamsXModule } from '../x-module';

  /**
   * It emits a {@link ExtraParamsXEvents.ExtraParamsProvided} with the values
   * received as a prop.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(extraParamsXModule)]
  })
  export default class ExtraParams extends Vue {
    /**
     * Emits the initial extra params, overriding with the state extra params, just in case, those
     * values were already set by XComponents initialization (url, plugin config, etc.).
     */
    created(): void {
      this.$x.emit('ExtraParamsInitialized', { ...this.values });
      this.$x.emit('ExtraParamsProvided', { ...this.values, ...this.storeExtraParams });
    }

    /**
     * (Required) A Dictionary where the keys are the extra param names and its values.
     *
     * @remarks Emits the {@link ExtraParamsXEvents.ExtraParamsProvided} when the
     * component is rendered or the values changed.
     *
     * @public
     */
    @XEmit('ExtraParamsProvided', { immediate: false, deep: true })
    @Prop({ required: true })
    public values!: Dictionary<unknown>;

    /**
     * State extra params. Used to override the initial extra params.
     */
    @State('extraParams', 'params')
    public storeExtraParams!: Dictionary<unknown>;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<docs lang="mdx">
## Events

- [`ExtraParamsProvided`][1]

[1](./../../api/x-components.extraparamsxevents.extraparamsprovided.md)

## See it in action

_See how the event is triggered when the component is rendered._

```vue
<template>
  <ExtraParams :values="values" />
</template>

<script>
  import { ExtraParams } from '@empathyco/x-components/extra-params';

  export default {
    name: 'ExtraParamsDemo',
    components: {
      ExtraParams
    },
    data() {
      return {
        values: {
          warehouse: 1234
        }
      };
    }
  };
</script>
```
</docs>
