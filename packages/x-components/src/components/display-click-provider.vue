<script lang="ts">
import type { TaggingRequest } from '@empathyco/x-types'
import type { PropType } from 'vue'

import type { ResultFeature } from '../types/index'
import type { DisplayWireMetadata } from '../wiring/index'
import { computed, defineComponent, provide } from 'vue'
import { use$x } from '../composables/index'

export default defineComponent({
  name: 'DisplayClickProvider',
  props: {
    resultFeature: {
      type: String as PropType<ResultFeature>,
      required: true,
    },
    ignoreResultClickEvent: {
      type: Boolean,
      default: false,
    },
    toolingDisplayTagging: {
      type: Object as PropType<TaggingRequest>,
      required: false,
      default: undefined,
    },
    toolingAdd2CartTagging: {
      type: Object as PropType<TaggingRequest>,
      required: false,
      default: undefined,
    },
    queryTagging: {
      type: Object as PropType<TaggingRequest>,
      required: false,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const x = use$x()

    const displayClickMetadata = computed<Partial<DisplayWireMetadata>>(() => ({
      displayOriginalQuery: x.query.search,
      feature: props.resultFeature,
      queryTagging: props.queryTagging,
      toolingTagging: props.toolingDisplayTagging,
      toolingAdd2CartTagging: props.toolingAdd2CartTagging,
    }))

    const resultAddToCartExtraEventsMap: Partial<Record<ResultFeature, string>> = {
      related_prompts: 'UserClickedARelatedPromptAdd2Cart',
      overview: 'UserClickedAnAiOverviewAdd2Cart',
    }

    const resultClickExtraEventsMap: Partial<Record<ResultFeature, string>> = {
      related_prompts: 'UserClickedARelatedPromptResult',
      overview: 'UserClickedAnAiOverviewResult',
    }

    provide('resultAddToCartExtraEvents', [resultAddToCartExtraEventsMap[props.resultFeature]])
    provide('resultAddToCartExtraEventsMetadata', {
      toolingAdd2CartTagging: props.toolingAdd2CartTagging,
    })

    provide('resultClickExtraEvents', [
      resultClickExtraEventsMap[props.resultFeature],
      'UserClickedADisplayResult',
    ])
    provide('resultLinkMetadataPerEvent', {
      UserClickedARelatedPromptResult: displayClickMetadata.value,
      UserClickedAnAiOverviewResult: displayClickMetadata.value,
      UserClickedADisplayResult: displayClickMetadata.value,
      ...(props.ignoreResultClickEvent && {
        UserClickedAResult: {
          ignoreInModules: ['tagging'],
        },
      }),
    })

    return () => slots.default?.()[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Usage

The `DisplayClickProvider` component is used to provide context and event metadata for display result clicks and add-to-cart actions. It should wrap the content that needs to access these events and metadata via Vue's provide/inject mechanism.

### Basic example

```vue
<template>
  <DisplayClickProvider :resultFeature="'overview'">
    <ResultCard :result="result" />
  </DisplayClickProvider>
</template>

<script setup>
import { DisplayClickProvider } from '@empathyco/x-components'
import ResultCard from './ResultCard.vue'
const result = {
  /* ...result data... */
}
</script>
```

### With tagging and ignoring result click event

```vue
<template>
  <DisplayClickProvider
    :resultFeature="'related_prompts'"
    :toolingDisplayTagging="displayTagging"
    :toolingAdd2CartTagging="add2CartTagging"
    :queryTagging="queryTagging"
    :ignoreResultClickEvent="true"
  >
    <ResultCard :result="result" />
  </DisplayClickProvider>
</template>

<script setup>
import { DisplayClickProvider } from '@empathyco/x-components'
import ResultCard from './ResultCard.vue'
const result = {
  /* ...result data... */
}
const displayTagging = {
  /* ...tagging data... */
}
const add2CartTagging = {
  /* ...tagging data... */
}
const queryTagging = {
  /* ...tagging data... */
}
</script>
```

### Notes

- The component uses Vue 3's provide/inject API and is intended for use in Vue 3 projects.
- All props are reactive and can be updated dynamically.
- The default slot is required and should contain the content that will use the provided context.
</docs>
