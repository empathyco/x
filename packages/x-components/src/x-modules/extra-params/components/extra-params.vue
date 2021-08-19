<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin, XEmit } from '../../../components';
  import { Dictionary } from '../../../utils';
  import { extraParamsXModule } from '../x-module';

  /**
   * It emits a {@link ExtraParamsXEvents.ExtraRequestParamsProvided}
   * with the values received as a prop.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(extraParamsXModule)]
  })
  export default class ExtraParams extends Vue {
    /**
     * (Required) A Dictionary where the keys are the extra param names and its values.
     *
     * @remarks Emits the {@link ExtraParamsXEvents.ExtraRequestParamsProvided} when the
     * component is rendered or the values changed.
     *
     * @public
     */
    @XEmit('ExtraRequestParamsProvided', { immediate: true, deep: true })
    @Prop({ required: true })
    public values!: Dictionary<unknown>;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<docs lang="mdx">
## Events

- [`ExtraRequestParamsProvided`][1]

[1](./../../api/x-components.extraparamsxevents.extrarequestparamsprovided.md)

## See it in action

_See how the event is triggered when the component is rendered._

```vue
<template>
  <ExtraParams :values="{ warehouse: 123456789 }" />
</template>

<script>
  import { ExtraParams } from '@empathyco/x-components/extra-params.vue';

  export default {
    name: 'ExtraParamsDemo',
    components: {
      ExtraParams
    }
  };
</script>
```
</docs>
