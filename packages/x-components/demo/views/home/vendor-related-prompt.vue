<template>
  <RelatedPrompt
    ref="relatedPromptRef"
    :related-prompt="relatedPrompt"
    class="xds:rounded-xl xds:bg-amber-300"
    @click="emit('UserClickedAVendorRelatedPrompt', relatedPrompt)"
  />
</template>

<script setup lang="ts">
import type { VendorRelatedPrompt } from '@x/x-modules/vendor'
import type { PropType } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { useXBus } from '@x/composables'
import { RelatedPrompt } from '@x/x-modules/related-prompts'
import { onMounted, useTemplateRef, watch } from 'vue'

const props = defineProps({
  relatedPrompt: {
    type: Object as PropType<VendorRelatedPrompt>,
    required: true,
  },
})

const { emit } = useXBus()

onMounted(() => {
  void emit('VendorRelatedPromptMounted', props.relatedPrompt)
})

const relatedPromptRef = useTemplateRef('relatedPromptRef')
const isVisible = useElementVisibility(relatedPromptRef, { once: true })
watch(isVisible, async visible => {
  visible && (await emit('UserViewedAVendorRelatedPrompt', props.relatedPrompt))
})
</script>
