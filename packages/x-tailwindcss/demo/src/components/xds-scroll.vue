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
      class="x-bg-warning-25 h-[200px] w-[200px]"
    >
      <div :key="cssClass" class="h-[1000px]"></div>
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
