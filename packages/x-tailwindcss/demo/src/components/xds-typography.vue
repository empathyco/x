<template>
  <div>
    <XdsBaseShowcase
      v-for="(type, key) in typography"
      :key="key"
      v-slot="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
      :title="key"
      :sections="sections(type)"
    >
      <h1>{{ removeClassPrefix(cssClass, type.base) }}</h1>
      <p
        :key="cssClass"
        :class="cssClass"
        title="Click me to copy CSS classes"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida posuere nisi, sed
        porttitor sem semper ac. Aliquam erat volutpat
      </p>
    </XdsBaseShowcase>
  </div>
</template>

<script lang="ts">
  import type { ShowcaseSections } from '../types/types';
  import { defineComponent } from 'vue';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase
    },
    computed: {
      typography(): Record<string, { base: string; sizes: string[] }> {
        return {
          'Text 1': {
            base: 'x-text1',
            sizes: ['x-text1-sm', 'x-text1-md', 'x-text1-lg']
          },
          'Text 2': {
            base: 'x-text2',
            sizes: ['x-text2-sm', 'x-text2-md', 'x-text2-lg']
          },
          'Title 1': {
            base: 'x-title1',
            sizes: ['x-title1-sm', 'x-title1-md', 'x-title1-lg']
          },
          'Title 2': {
            base: 'x-title2',
            sizes: ['x-title2-sm', 'x-title2-md', 'x-title2-lg']
          },
          'Title 3': {
            base: 'x-title3',
            sizes: ['x-title3-sm', 'x-title3-md', 'x-title3-lg']
          },
          'Title 4': {
            base: 'x-title4',
            sizes: ['x-title4-sm', 'x-title4-md', 'x-title4-lg']
          }
        };
      }
    },
    methods: {
      sections(type: { base: string; sizes: string[] }): ShowcaseSections {
        return {
          Default: [type.base],
          Sizes: type.sizes.map(addParentClasses(type.base))
        };
      },
      copyCssClassesToClipboard(event: MouseEvent): void {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      },
      removeClassPrefix(cssClasses: string, prefix: string): string {
        return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
      }
    }
  });
</script>
