<template>
  <BaseResultLink :result="result">
    <template #default="{ result }">
      <BaseResultImage :result="result" />
      <span>{{ result.name }}</span>
    </template>
  </BaseResultLink>
</template>

<script lang="ts">
  import { Result } from '@empathy/search-types';
  import { BaseResultLink, BaseResultImage } from '@empathy/x-components';
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      BaseResultLink,
      BaseResultImage
    }
  })
  export default class ResultComponent extends Vue {
    @Prop()
    public result!: Result;
  }
</script>
