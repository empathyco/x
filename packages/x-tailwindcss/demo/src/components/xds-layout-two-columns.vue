<template>
  <XdsBaseShowcase
    #default="{ cssClass, removeClassPrefix }"
    title="Layout Two Columns"
    :sections="sections"
  >
    <button @click="openModal(cssClass)" class="x-button">
      {{ removeClassPrefix(cssClass, base).trim() }}
    </button>

    <dialog :ref="cssClass" class="modal x-bg-neutral-25">
      <div :class="[cssClass, 'x-layout-min-margin-32']">
        <div class="x-layout-item x-bg-neutral-0 x-border-1 x-border-neutral-10">
          <div class="x-flex x-justify-between x-items-center">
            <h1 class="x-title1">
              <code>{{ removeClassPrefix(cssClass, base).trim() }}</code>
              <span class="x-title4 x-title4-md">
                with
                <code>x-layout-min-margin-32</code>
              </span>
            </h1>
            <form method="dialog" class="x-flex x-p-16">
              <button @click="enableScroll" class="x-button x-button-ghost" value="default">
                Close
              </button>
            </form>
          </div>
        </div>

        <div class="x-layout-item">
          <div class="x-flex x-justify-between x-items-center x-p-16">
            <div>HEADER START</div>
            <div>HEADER MIDDLE</div>
            <div>HEADER END</div>
          </div>
        </div>
        <div class="x-layout-item x-no-margin-right x-layout-expand">
          <div class="x-flex x-layout-expand">
            <div class="x-scroll x-w-128 x-bg-neutral-50">
              <div class="x-flex x-flex-col x-justify-between x-h-[2000px]">
                <span>ASIDE</span>
                <span class="x-place-self-end">ASIDE BOTTOM</span>
              </div>
            </div>

            <div class="x-scroll x-layout-expand x-flex-1 x-bg-neutral-50">
              <div class="x-layout-item x-layout-no-margin-left">
                <div class="x-flex x-flex-col x-justify-between x-h-[2000px]">
                  <section>MAIN</section>
                  <span class="x-place-self-end">MAIN BOTTOM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  @Component({
    components: {
      XdsBaseShowcase
    }
  })
  export default class XdsLayoutTwoColumnsShowcase extends Vue {
    @Prop({ default: 'x-layout-container' })
    public base!: string;

    @Prop({ default: () => ['x-layout-sm ', 'x-layout-md', 'x-layout-lg', 'x-layout-full'] })
    public sizes!: string[];

    protected get sections(): ShowcaseSections {
      return {
        Sizes: this.sizes.map(addParentClasses(this.base))
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
