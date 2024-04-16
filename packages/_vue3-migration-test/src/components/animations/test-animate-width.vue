<template>
  <div>
    <button @click="visible = !visible">Toggle</button>
    <AnimateWidth>
      <div v-if="visible" style="width: 300px">Element to animate</div>
    </AnimateWidth>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import AnimateWidth from '../../../../x-components/src/components/animations/animate-width.vue';

  export default defineComponent({
    name: 'TestAnimateWidth',
    components: {
      AnimateWidth
    },
    setup: function () {
      const visible = ref(true);

      return {
        visible
      };
    }
  });
</script>
