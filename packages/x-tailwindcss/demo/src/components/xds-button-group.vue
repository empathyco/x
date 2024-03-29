<template>
  <XdsBaseShowcase
    title="Button Group"
    :sections="sections"
    #default="{ cssClass, copyCssClassesToClipboard }"
  >
    <div class="x-flex x-gap-20 x-flex-wrap">
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
        class="x-gap-8"
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
        class="x-gap-8"
      >
        <button class="x-button x-button-outlined">BUTTON 1</button>
        <button class="x-button x-button-outlined">BUTTON 2</button>
        <button class="x-button">BUTTON 3</button>
      </div>

      <div
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        class="x-gap-8"
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
        class="x-text-accent-50 x-gap-8"
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
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import PlusIcon from './icons/plus.vue';

  @Component({
    components: { XdsBaseShowcase, PlusIcon }
  })
  export default class XdsButtonGroup extends Vue {
    @Prop({
      default: () => 'x-button-group'
    })
    public base!: string;

    @Prop({
      default: () => ['x-rounded-md']
    })
    public rounded!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Rounded: this.rounded.map(addParentClasses(this.base))
      };
    }
  }
</script>
