<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard }"
    title="Layout"
    :sections="sections"
  >
    <button @click="openModal" class="x-button">One Column Layout</button>

    <dialog ref="modal" class="modal">
      <form method="dialog" class="x-flex x-justify-end">
        <button @click="enableScroll" class="x-button x-button-ghost" value="default">Close</button>
      </form>
      <div
        :key="cssClass"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        title="Click me to copy CSS classes"
        class="x-bg-neutral-50 x-layout-container-sm x-layout-min-margin-48"
      >
        <div v-for="(item, index) in items" :key="index" :class="item.class">
          <span>{{ item.content }} - {{ index }}</span>
        </div>
      </div>
    </dialog>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  @Component({
    components: {
      XdsBaseShowcase
    }
  })
  export default class XdsLayoutShowcase extends Vue {
    @Prop({ default: 'x-layout-container' })
    public base!: string;

    @Prop({
      default: () => [
        {
          class: 'x-layout-item x-bg-accent-50',
          content: 'layout item'
        },
        {
          class: 'x-layout-item x-bg-warning-75',
          content: 'layout item'
        }
      ]
    })
    public items!: object[];

    protected get sections(): ShowcaseSections {
      return {
        Default: [this.base]
      };
    }

    openModal(): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (this.$refs.modal as any).showModal();
      document.documentElement.style.overflow = 'hidden';
    }

    enableScroll(): void {
      document.documentElement.style.overflow = '';
    }

    destroyed(): void {
      this.enableScroll();
    }
  }
</script>

<style lang="scss" scoped>
  .modal {
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }

  .x-layout-item {
    height: var(--x-layout-min-margin);
  }
</style>
