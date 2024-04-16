<template>
  <div>
    <button @click="shouldRender = !shouldRender">Toggle</button>
    <Fade>
      <p v-if="shouldRender">León is southern Spain</p>
    </Fade>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Fade from '../../../../x-components/src/components/animations/fade.vue';

  export default defineComponent({
    name: 'TestFade',
    components: {
      Fade
    },
    setup: function () {
      const shouldRender = ref(false);

      return {
        shouldRender
      };
    }
  });
</script>
