<template>
  <XdsBaseShowcase #default="{ cssClass, removeClassPrefix }" title="Layout" :sections="sections">
    <button @click="openModal(cssClass)" class="x-button">
      {{ removeClassPrefix(cssClass, base).trim() }}
    </button>

    <dialog :ref="cssClass" class="modal x-bg-neutral-25">
      <div :class="[cssClass, { 'x-layout-min-margin-32': !cssClass.includes('x-layout-full') }]">
        <div class="x-layout-item x-bg-neutral-0 x-border-1 x-border-neutral-10">
          <div class="x-flex x-justify-between x-items-center">
            <h1 class="x-title1">
              <code>{{ removeClassPrefix(cssClass, base).trim() }}</code>
              <span v-if="!cssClass.includes('x-layout-full')" class="x-title4 x-title4-md">
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

        <div class="x-layout-item x-bg-warning-50 x-border-1 x-border-neutral-10">
          <div class="x-p-16 x-bg-auxiliary-50"><code>x-layout-item</code></div>
        </div>

        <div class="x-layout-item x-layout-overlap-from-top">
          <div class="x-justify-self-center x-mt-16">
            <button class="x-button x-button-sm x-button-highlight">
              item inside
              <code>x-layout-overlap-from-top</code>
            </button>
          </div>
        </div>

        <div class="x-scroll x-max-h-[150px]">
          <div class="x-layout-item x-bg-warning-50 x-border-1 x-border-neutral-10">
            <div class="x-bg-neutral-0 x-p-16 x-h-[350px]">
              <code>x-layout-item</code>
              inside
              <code>x-scroll</code>
            </div>
          </div>
        </div>

        <div class="x-bg-neutral-25 x-border-1 x-border-neutral-10">
          <div class="x-p-16">
            not a
            <code>x-layout-item</code>
          </div>
        </div>

        <div
          class="x-layout-item x-layout-no-margin x-bg-warning-50 x-border-1 x-border-neutral-10"
        >
          <div class="x-bg-success-50 x-p-16">
            <code>x-layout-item</code>
            with no margin (
            <code>x-layout-no-margin</code>
            )
          </div>
        </div>

        <div
          class="x-layout-item x-layout-no-margin-left x-bg-warning-50 x-border-1 x-border-neutral-10"
        >
          <div class="x-bg-success-50 x-p-16">
            <code>x-layout-item</code>
            with no margin left (
            <code>x-layout-no-margin-left</code>
            )
          </div>
        </div>

        <div
          class="x-layout-item x-layout-no-margin-right x-bg-warning-50 x-border-1 x-border-neutral-10"
        >
          <div class="x-bg-success-50 x-p-16">
            <code>x-layout-item</code>
            with no margin right (
            <code>x-layout-no-margin-right</code>
            )
          </div>
        </div>

        <div class="x-layout-item x-layout-expand x-bg-warning-50 x-border-1 x-border-neutral-10">
          <div class="x-layout-expand x-bg-auxiliary-25 x-p-16">
            <code>x-layout-item</code>
            expanded with
            <code>x-layout-expand</code>
          </div>
        </div>

        <div v-if="!cssClass.includes('x-layout-full')" class="x-layout-item x-layout-overlap">
          <div class="x-layout-on-margin-left x-mb-16 x-ml-auto">
            <span
              class="x-button x-button-sm x-button-accent"
              style="text-orientation: sideways; writing-mode: vertical-lr"
            >
              x-layout-on-margin-left
            </span>
          </div>
          <div class="x-layout-on-margin-right x-mb-16 x-mr-auto">
            <span
              class="x-button x-button-sm x-button-accent"
              style="text-orientation: sideways; writing-mode: vertical-lr"
            >
              x-layout-on-margin-right
            </span>
          </div>
        </div>

        <div class="x-layout-item x-layout-overlap">
          <div class="x-flex x-flex-row">
            <div class="x-mb-16 x-self-start x-mr-auto">
              <button class="x-button x-button-sm x-button-highlight">
                item inside
                <code>x-layout-overlap</code>
              </button>
            </div>
            <div class="x-mb-16 x-self-end">
              <button class="x-button x-button-sm x-button-highlight">
                item inside
                <code>x-layout-overlap</code>
              </button>
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
  export default class XdsLayoutShowcase extends Vue {
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
