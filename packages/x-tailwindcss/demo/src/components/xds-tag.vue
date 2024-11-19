<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Tag"
    :sections="sections"
  >
    <button
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
    >
      {{ removeClassPrefix(cssClass, base) }} tag
      <PlusIcon class="x-icon" />
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import PlusIcon from './icons/plus.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase,
      PlusIcon
    },
    props: {
      base: {
        type: String,
        default: 'x-tag'
      },
      sizes: {
        type: Array as PropType<string[]>,
        default: () => ['x-tag-sm', 'x-tag-md', 'x-tag-lg']
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [
          '',
          'x-tag-neutral',
          'x-tag-lead',
          'x-tag-auxiliary',
          'x-tag-accent',
          'x-tag-highlight',
          'x-tag-success',
          'x-tag-warning',
          'x-tag-error'
        ]
      },
      selected: {
        type: String,
        default: 'x-selected'
      },
      outlined: {
        type: String,
        default: 'x-tag-outlined'
      },
      solid: {
        type: String,
        default: 'x-tag-solid'
      },
      ghost: {
        type: String,
        default: 'x-tag-ghost'
      },
      tight: {
        type: String,
        default: 'x-tag-tight'
      },
      combinations: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-tag-lead x-tag-sm',
          'x-tag-auxiliary x-tag-outlined x-tag-lg x-selected',
          'x-tag-highlight x-tag-solid x-tag-lg x-selected',
          'x-tag-success x-tag-tight x-tag-sm x-selected',
          'x-tag-warning x-tag-ghost x-selected'
        ]
      }
    },
    setup(props) {
      const sections = computed<ShowcaseSections>(() => ({
        Default: [props.base],
        Sizes: props.sizes.map(addParentClasses(props.base)),
        Colors: props.colors.map(addParentClasses(props.base)),
        ['Default Selected']: props.colors.map(addParentClasses(props.base, props.selected)),
        Outlined: props.colors.map(addParentClasses(props.base, props.outlined)),
        ['Outlined Selected']: props.colors.map(
          addParentClasses(props.base, props.selected, props.outlined)
        ),
        Solid: props.colors.map(addParentClasses(props.base, props.solid)),
        ['Solid Selected']: props.colors.map(
          addParentClasses(props.base, props.selected, props.solid)
        ),
        Ghost: props.colors.map(addParentClasses(props.base, props.ghost)),
        ['Ghost Selected']: props.colors.map(
          addParentClasses(props.base, props.selected, props.ghost)
        ),
        Tight: props.colors.map(addParentClasses(props.base, props.tight)),
        ['Tight Selected']: props.colors.map(
          addParentClasses(props.base, props.selected, props.tight)
        ),
        Disabled: [
          props.base,
          addParentClasses(props.base)(props.selected),
          addParentClasses(props.base)(props.outlined),
          addParentClasses(props.base, props.selected)(props.outlined),
          addParentClasses(props.base)(props.solid),
          addParentClasses(props.base, props.selected)(props.solid),
          addParentClasses(props.base)(props.ghost),
          addParentClasses(props.base, props.selected)(props.ghost),
          addParentClasses(props.base)(props.tight),
          addParentClasses(props.base, props.selected)(props.tight)
        ],
        Combinations: props.combinations.map(addParentClasses(props.base))
      }));

      const copyCssClassesToClipboard = (event: MouseEvent): void => {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      };

      const removeClassPrefix = (cssClasses: string, prefix: string): string => {
        return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
      };

      return { sections, copyCssClassesToClipboard, removeClassPrefix };
    }
  });
</script>
