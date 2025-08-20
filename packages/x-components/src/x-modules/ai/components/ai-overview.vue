<template>
  <div>
    <span> Current question: {{ currentQuestion?.suggestionText }} </span>
    <span> Current loading: {{ currentQuestionLoading }} </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGetter } from '../../../composables'
import { aiXModule } from '../x-module'

export default defineComponent({
  name: 'AiOverview',
  xModule: aiXModule.name,
  setup() {
    const { currentQuestion, currentQuestionLoading } = useGetter('ai')

    return { currentQuestion, currentQuestionLoading }
  },
})
</script>

<style scoped lang="css"></style>
