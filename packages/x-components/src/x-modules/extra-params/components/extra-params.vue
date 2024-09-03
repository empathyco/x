<script lang="ts">
  import { Dictionary } from '@empathyco/x-utils';
  import { ComputedRef, defineComponent, PropType, watch } from 'vue';
  import { extraParamsXModule } from '../x-module';
  import { use$x } from '../../../composables/use-$x';
  import { useState } from '../../../composables/use-state';

  /**
   * It emits a {@link ExtraParamsXEvents.ExtraParamsProvided} with the values
   * received as a prop.
   *
   * @public
   */

  export default defineComponent({
    name: 'ExtraParams',
    xModule: extraParamsXModule.name,
    props: {
      values: {
        type: Object as PropType<Dictionary<unknown>>,
        required: true
      }
    },
    setup(props) {
      const params: ComputedRef<Dictionary> = useState('extraParams', ['params']).params;
      const $x = use$x();

      $x.emit('ExtraParamsInitialized', { ...props.values });
      $x.emit('ExtraParamsProvided', { ...props.values, ...params.value });

      watch(
        () => props.values,
        values => {
          $x.emit('ExtraParamsProvided', { ...values });
        },
        { deep: true }
      );
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
  });
</script>

<docs lang="mdx">
## Events

- [`ExtraParamsProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

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
