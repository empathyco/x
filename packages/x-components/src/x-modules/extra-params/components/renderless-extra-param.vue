<template>
  <NoElement>
    <slot v-bind="{ value, updateValue }"></slot>
  </NoElement>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { NoElement } from '../../../components/no-element';
  import { extraParamsXModule } from '../x-module';
  import { useState, useXBus } from '../../../composables';

  /**
   * It emits a {@link ExtraParamsXEvents.UserChangedExtraParams} when the `updateValue`
   * is called.
   *
   * @public
   */
  export default defineComponent({
    name: 'RenderlessExtraParam',
    xModule: extraParamsXModule.name,
    components: {
      NoElement
    },
    props: {
      name: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const xBus = useXBus();
      /**
       * A dictionary with the extra params in the store state.
       *
       * @public
       */
      const stateParams = useState('extraParams', ['params']).params;

      /**
       * It returns the value of the extra param from the store.
       *
       * @returns - The value from the store.
       *
       * @internal
       */
      const value = computed(() => {
        return stateParams.value[props.name];
      });

      /**
       * It sets the new value to the store.
       *
       * @param newValue - The new value of the extra param.
       *
       * @internal
       */
      function updateValue(newValue: unknown) {
        xBus.emit('UserChangedExtraParams', { [props.name]: newValue });
      }

      return { value, updateValue };
    }
  });
</script>

<docs lang="mdx">
## Examples

Renders default slot content. It binds to the default slot the name of the extra parameter and the
default value of it.

### Basic usage

```vue
<template>
  <RenderlessExtraParam #default="{ value, updateValue }" name="store">
    <BaseDropdown @update:modelValue="updateValue" :modelValue="value" :items="items" />
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
