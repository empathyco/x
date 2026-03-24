<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useState } from '../../../composables/use-state'
import { useXBus } from '../../../composables/use-x-bus'
import { extraParamsXModule } from '../x-module'

/**
 * It emits a {@link ExtraParamsXEvents.UserChangedExtraParams} when the `updateValue`
 * is called.
 *
 * @public
 */
export default defineComponent({
  name: 'RenderlessExtraParam',
  xModule: extraParamsXModule.name,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const xBus = useXBus()

    /** A dictionary with the extra params in the store state. */
    const stateParams = useState('extraParams').params

    /** It returns the value of the extra param from the store. */
    const extraParam = computed(() => stateParams.value[props.name])

    /**
     * It sets the new value to the store.
     *
     * @param newValue - The new value of the extra param.
     */
    function updateValue(newValue: unknown) {
      xBus.emit('UserChangedExtraParams', { [props.name]: newValue })
    }

    return () => slots.default?.({ value: extraParam.value, updateValue })[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Examples

Renders default slot content. It binds to the default slot the name of the extra parameter and the
default value of it.

### Basic usage

```vue
<template>
  <RenderlessExtraParam v-slot="{ value, updateValue }" name="store">
    <BaseDropdown @update:modelValue="updateValue" :modelValue="value" :items="items" />
  </RenderlessExtraParam>
</template>

<script setup>
import RenderlessExtraParam from '@empathyco/x-components/js/x-modules/extra-params/components/renderless-extra-param.vue'
import BaseDropdown from '@empathyco/x-components/js/components/base-dropdown.vue'
import { ref } from 'vue'
const items = ref(['spain', 'portugal'])
</script>
```
</docs>
