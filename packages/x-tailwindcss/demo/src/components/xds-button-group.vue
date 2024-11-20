<template>
  <XdsBaseShowcase
    title="Button Group"
    :sections="sections"
    #default="{ cssClass, copyCssClassesToClipboard }"
  >
    <div class="flex flex-wrap gap-5">
      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
      >
        <button class="x-button">BUTTON 1</button>
        <button class="x-button">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="gap-2"
      >
        <button class="x-button">BUTTON 1</button>
        <span class="x-button-group-divider" />
        <button class="x-button">BUTTON 2</button>
        <span class="x-button-group-divider" />
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="gap-2"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="gap-2"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <span class="x-button-group-divider" />
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <span class="x-button-group-divider" />
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="x-text-accent-50"
      >
        <button class="x-button x-button-ghost">BUTTON 1</button>
        <span class="x-button-group-divider" />
        <button class="x-button x-button-ghost">BUTTON 2</button>
        <span class="x-button-group-divider" />
        <button class="x-button x-button-ghost x-button-warning">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="x-text-accent-50 gap-2"
      >
        <button class="x-button x-button-tight">BUTTON 1</button>
        <button class="x-button x-button-tight">BUTTON 2</button>
        <button class="x-button x-button-tight x-button-warning">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="x-text-accent-50"
      >
        <button class="x-button x-button-highlight x-button-circle">
          <PlusIcon class="x-icon" />
        </button>
        <button class="x-button x-button-ghost x-button-success x-button-square">
          <PlusIcon class="x-icon" />
        </button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="x-text-accent-50"
      >
        <button class="x-button x-button-highlight x-button-square">
          <PlusIcon class="x-icon" />
        </button>
        <button class="x-button x-button-ghost x-button-success x-button-square">
          <PlusIcon class="x-icon" />
        </button>
      </div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import PlusIcon from './icons/plus.vue';

  export default defineComponent({
    components: { XdsBaseShowcase, PlusIcon },
    props: {
      base: {
        type: String,
        default: 'x-button-group'
      },
      rounded: {
        type: Array as PropType<string[]>,
        default: () => ['x-rounded-md']
      }
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          Default: [this.base],
          Rounded: this.rounded.map(addParentClasses(this.base))
        };
      }
    }
  });
</script>
