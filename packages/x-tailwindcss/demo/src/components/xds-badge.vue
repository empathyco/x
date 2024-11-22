<template>
  <XdsBaseShowcase
    #default="{ cssClass, removeClassPrefix, copyCssClassesToClipboard, section }"
    title="Badge"
    :sections="sections"
    :sectionsClasses="sectionClasses"
  >
    <button v-if="cssClass.includes('attach')" class="x-button x-attach-container">
      {{ removeClassPrefix(cssClass, base) }}
      <span
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
      >
        10
      </span>
    </button>
    <span
      v-else
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
      :class="cssClass"
    >
      <CuratedIcon v-if="section === 'WithIcon'" class="x-icon" />
      <template v-else>
        {{ !cssClass.includes('circle') ? `${removeClassPrefix(cssClass, base)} badge` : '1' }}
      </template>
    </span>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
  import { ShowcaseSectionsClasses } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CuratedIcon from './icons/curated.vue';

  type Sections =
    | 'Default'
    | 'Sizes'
    | 'Circle'
    | 'Colors'
    | 'Light'
    | 'Outlined'
    | 'Bright'
    | 'AttachTo'
    | 'WithIcon'
    | 'Combinations';
  export default defineComponent({
    components: {
      XdsBaseShowcase,
      CuratedIcon
    },
    props: {
      base: {
        type: String,
        default: () => 'x-badge'
      },
      sizes: {
        type: Array as PropType<string[]>,
        default: () => ['x-badge-sm', 'x-badge-md']
      },
      circle: {
        type: String,
        default: () => 'x-badge-circle'
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [
          '',
          'x-badge-neutral',
          'x-badge-lead',
          'x-badge-auxiliary',
          'x-badge-accent',
          'x-badge-highlight',
          'x-badge-success',
          'x-badge-warning',
          'x-badge-error'
        ]
      },
      light: {
        type: String,
        default: () => 'x-badge-light'
      },
      outlined: {
        type: String,
        default: () => 'x-badge-outlined'
      },
      bright: {
        type: String,
        default: () => 'x-badge-bright'
      },
      attachTo: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-attach-to-top-left',
          'x-attach-to-top-right',
          'x-attach-to-bottom-left',
          'x-attach-to-bottom-right'
        ]
      },
      withIcon: {
        type: Array as PropType<string[]>,
        default: () => ['x-badge-sm', '', 'x-badge-circle x-badge-sm', 'x-badge-circle']
      },
      combinations: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-badge-error x-badge-sm x-badge-outlined',
          'x-badge-light x-badge-lead x-badge-circle',
          'x-badge-outlined x-badge-circle x-badge-warning x-badge-sm',
          'x-badge-light x-badge-outlined x-badge-auxiliary',
          'x-badge-circle x-badge-light x-badge-lead x-attach-to-top-right',
          'x-badge-sm x-badge-highlight x-attach-to-top-right'
        ]
      }
    },
    setup(props) {
      const sectionClasses: ShowcaseSectionsClasses<Sections> = {
        Bright: 'bg-gray-700 p-8'
      };
      const sections = computed(() => {
        return {
          Default: [props.base],
          Sizes: props.sizes.map(addParentClasses(props.base)),
          Circle: props.sizes.map(addParentClasses(props.base, props.circle)),
          Colors: props.colors.map(addParentClasses(props.base)),
          Light: props.colors.map(addParentClasses(props.base, props.light)),
          Outlined: props.colors.map(addParentClasses(props.base, props.outlined)),
          Bright: props.colors.map(addParentClasses(props.base, props.bright)),
          AttachTo: props.attachTo.map(addParentClasses(props.base)),
          WithIcon: props.withIcon.map(addParentClasses(props.base)),
          Combinations: props.combinations.map(addParentClasses(props.base))
        };
      });

      return {
        sectionClasses,
        sections
      };
    }
  });
</script>
