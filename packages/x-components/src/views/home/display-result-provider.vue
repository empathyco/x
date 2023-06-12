<template>
  <NoElement>
    <slot />
  </NoElement>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { NoElement } from '../../components/no-element';

  export default defineComponent({
    components: {
      NoElement
    },
    provide() {
      return {
        resultClickExtraEvents: ['UserClickedADisplayResult']
      };
    }
  });
</script>
