<template>
  <div>
    <XdsBaseShowcase
      v-for="(type, key) in typography"
      :key="key"
      #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
      :title="`Typography || ${type.base}`"
      :sections="sections(type)"
    >
      <h1>{{ removeClassPrefix(cssClass, type.base) }}</h1>
      <p
        :key="cssClass"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        title="Click me to copy CSS classes"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida posuere nisi, sed
        porttitor sem semper ac. Aliquam erat volutpat
      </p>
    </XdsBaseShowcase>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CuratedIcon from './icons/curated.vue';

  @Component({
    components: {
      XdsBaseShowcase,
      CuratedIcon
    }
  })
  export default class XdsTypographyShowCase extends Vue {
    protected get typography(): Record<string, { base: string; sizes: string[] }> {
      return {
        'x-text1': {
          base: 'x-text1',
          sizes: ['x-text1-sm', 'x-text1-md', 'x-text1-lg']
        },
        'x-text2': {
          base: 'x-text2',
          sizes: ['x-text2-sm', 'x-text2-md', 'x-text2-lg']
        },
        'x-title1': {
          base: 'x-title1',
          sizes: ['x-title1-sm', 'x-title1-md', 'x-title1-lg']
        },
        'x-title2': {
          base: 'x-title2',
          sizes: ['x-title2-sm', 'x-title2-md', 'x-title2-lg']
        },
        'x-title3': {
          base: 'x-title3',
          sizes: ['x-title3-sm', 'x-title3-md', 'x-title3-lg']
        }
      };
    }

    protected sections(type: { base: string; sizes: string[] }): ShowcaseSections {
      return {
        Default: [type.base],
        Sizes: type.sizes.map(addParentClasses(type.base))
      };
    }
  }
</script>
