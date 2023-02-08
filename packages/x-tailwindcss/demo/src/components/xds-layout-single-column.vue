<template>
  <XdsBaseShowcase #default="{ cssClass }" title="Layout single column" :sections="sections">
    <button @click="openModal(cssClass)" class="x-button">Open layout example</button>

    <dialog :ref="cssClass" class="modal x-bg-neutral-10">
      <div :class="[cssClass, 'x-layout-min-margin-48']">
        <div class="x-layout-item x-bg-neutral-0 x-border-b-1 x-border-neutral-25">
          <div class="x-flex x-justify-between x-items-center x-py-8">
            <span class="x-title3">SINGLE COLUMN LAYOUT</span>
            <form method="dialog" class="x-flex">
              <button @click="enableScroll" class="x-button x-button-ghost" value="default">
                Close
              </button>
            </form>
          </div>
        </div>

        <div class="x-layout-item x-border-b-1 x-border-neutral-25">
          <div class="x-flex x-justify-between x-items-center x-py-16">
            <div class="x-title3">HEADER START</div>
            <div class="x-title2">HEADER MIDDLE</div>
            <div class="x-title3">HEADER END</div>
          </div>
        </div>

        <div class="x-layout-item x-border-b-1 x-border-neutral-25">
          <div class="x-flex x-justify-center x-p-16 x-title3">SUB HEADER</div>
        </div>

        <div class="x-layout-item x-layout-expand x-layout-no-margin-right x-bg-neutral-25">
          <div class="x-scroll x-layout-expand">
            <div class="x-flex x-flex-col x-justify-between x-h-[2000px] x-p-12">
              <section>MAIN</section>
              <span class="x-place-self-end">MAIN BOTTOM</span>
            </div>
          </div>
        </div>

        <div class="x-layout-item x-layout-overlap">
          <button class="x-justify-self-center x-self-end x-button x-mb-16">FLOATING</button>
        </div>

        <div class="x-layout-item">
          <div class="x-flex x-justify-center x-p-16 x-title3">FOOTER</div>
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
  export default class XdsLayoutSingleColumnShowcase extends Vue {
    @Prop({ default: 'x-layout-container x-layout-max-width-md' })
    public base!: string;

    protected get sections(): ShowcaseSections {
      return {
        '': [this.base]
      };
    }

    openModal(layoutSize: string): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (this.$refs[layoutSize] as any).showModal();
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
  code {
    text-decoration: underline;
  }
  .modal {
    height: 100vh;
    min-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }
</style>
