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

    provide('resultAddToCartExtraEvents', ['UserClickedARelatedPromptAdd2Cart'])
    provide('resultAddToCartExtraEventsMetadata', {
      toolingAdd2CartTagging: props.toolingAdd2CartTagging,
    })

    provide('resultClickExtraEvents', [
      'UserClickedARelatedPromptResult',
      'UserClickedADisplayResult',
    ])
    provide('resultLinkMetadataPerEvent', {
      UserClickedARelatedPromptResult: displayClickMetadata.value,
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
