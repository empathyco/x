<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard }"
    title="Scroll"
    :sections="sections"
  >
    <div
      @keydown="copyCssClassesToClipboard"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      class="x-h-[200px] x-w-[200px] x-bg-warning-25"
    >
      <div :key="cssClass" class="x-h-[1000px]"></div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase
    },
    props: {
      base: {
        type: String,
        default: 'x-scroll'
      }
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          Default: [this.base]
        };
      }
    },
    methods: {
      copyCssClassesToClipboard(event: MouseEvent): void {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      }
    }
  });
</script>

<style lang="scss" scoped>
  :deep(h2) {
    align-self: flex-start;
  }
</style>
