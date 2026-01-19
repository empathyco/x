<script lang="ts">
import type { SnippetConfig } from '../../../x-installer/api/api.types'
import type { TaggingConfig } from '../config.types'
import { computed, defineComponent, inject, onMounted, watch } from 'vue'
import { useXBus } from '../../../composables/use-x-bus'
import { taggingXModule } from '../x-module'
/**
 * This component enables and manages the sending of information to the
 * [Empathy Tagging API](https://docs.empathy.co/develop-empathy-platform/api-reference/tagging-api.html).
 * It allows you to activate or deactivate the session id management through the `consent` prop.
 *
 * @public
 */
export default defineComponent({
  name: 'Tagging',
  xModule: taggingXModule.name,
  props: {
    /**
     * The TTL in milliseconds for storing the result info.
     */
    storageTTLMs: {
      type: Number,
      default: 30000,
    },
    /**
     * The Object key of the {@link @empathyco/x-types#Result} clicked or added to the cart by the user
     * that will be used as id for the storage.
     * By default, the Result url will be used.
     */
    storageKey: {
      type: String,
      default: 'url',
    },
    /**
     * The session TTL in milliseconds.
     */
    sessionTTLMs: Number,
    /**
     * The debounce time in milliseconds to track the query.
     */
    queryTaggingDebounceMs: {
      type: Number,
      default: 2000,
    },
    /**
     * The consent to be emitted.
     */
    consent: {
      type: Boolean,
      default: null,
    },
  },
  setup(props) {
    const xBus = useXBus()

    /**
     * It injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
     */
    const snippetConfig = inject<SnippetConfig | undefined>('snippetConfig')

    /**
     * The active consent, selected from the `consent` prop and the `snippetConfig.consent`
     * property. False by default.
     *
     * @remarks If the consent is undefined in the prop and in the snippetConfig, it will return
     * false.
     *
     * @returns A boolean that represents if the consent is accepted or not.
     */
    const activeConsent = computed(() => props.consent ?? snippetConfig?.consent ?? false)

    /**
     * The tagging config to be emitted.
     */
    const taggingConfig = computed<TaggingConfig>(() => {
      return {
        queryTaggingDebounceMs: props.queryTaggingDebounceMs,
        sessionTTLMs: props.sessionTTLMs as number,
        storageTTLMs: props.storageTTLMs,
        storageKey: props.storageKey,
      }
    })

    /**
     * Emits the {@link TaggingXEvents.PDPIsLoaded} XEvent if the snippet config contains
     * a product id.
     */
    onMounted(() => {
      if (snippetConfig?.productId) {
        xBus.emit('PDPIsLoaded', snippetConfig.productId)
      }
    })

    /**
     * Emmits the consent when it changes.
     */
    watch(activeConsent, () => xBus.emit('ConsentProvided', activeConsent.value), {
      immediate: true,
    })

    /**
     * Emmits the tagging config when it changes.
     */
    watch(taggingConfig, () => xBus.emit('TaggingConfigProvided', taggingConfig.value), {
      immediate: true,
    })

    return () => {}
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`ConsentProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`TaggingConfigProvided`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

This component manages the tagging of the API to track the different features. This component
doesn't render elements to the DOM.

```vue
<template>
  <Tagging />
</template>

<script setup>
import { Tagging } from '@empathyco/x-components/tagging'
</script>
```

### Play with props

In this example, the `Tagging` component will emit `ConsentProvided` with payload false by default
if the consent is not provided, the `TaggingConfigProvided` event will be emitted only if the props
`queryTaggingDebounceMs`, `sessionDurationMs`, `storageTTLMs` or `storageKey` are defined.

Every time the user clicks a result or adds a result to the cart, the information for the product
will be stored on the browser during 30 seconds which is the default value for the prop
`storageTTLMs`. To distinguish the storage information for the different results the product url
will be used since `storageKey` default value is 'url'.

```vue
<template>
  <Tagging :consent="true" :queryTaggingDebounceMs="300" :sessionDurationMs="30000" />
</template>

<script setup>
import { Tagging } from '@empathyco/x-components/tagging'
</script>
```

In this example, the clicked or added to cart result information will be stored on the browser
during 60 seconds and the product id will be used as storage key

```vue
<template>
  <Tagging :storageTTLMs="60000" :storageKey="'id'" />
</template>

<script setup>
import { Tagging } from '@empathyco/x-components/tagging'
</script>
```

### Play with events

The `Tagging` will emit the `ConsentProvided` when the component is loaded and the consent is set by
the prop or getting the value from the snippet config.

The `Tagging` will emit the `TaggingConfigProvided` when the component is loaded with the new
[`TaggingConfig`](./../../api/x-components.taggingconfig.md) using the prop values.
</docs>
