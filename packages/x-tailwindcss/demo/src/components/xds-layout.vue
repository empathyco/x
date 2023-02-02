<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
    title="Layout"
    :sections="sections"
  >
    <button @click="openModal(cssClass)" class="x-button">
      {{ removeClassPrefix(cssClass, base).trim() }}
    </button>

    <dialog :ref="cssClass" class="modal x-bg-neutral-25">
      <form method="dialog" class="x-flex x-justify-end x-p-16">
        <button @click="enableScroll" class="x-button x-button-ghost" value="default">Close</button>
      </form>
      <div
        :key="cssClass"
        @click="copyCssClassesToClipboard"
        @keydown="copyCssClassesToClipboard"
        :class="cssClass"
        title="Click me to copy CSS classes"
      >
        <h1 class="x-title1">{{ removeClassPrefix(cssClass, base).trim() }}</h1>

        <div class="x-layout-item x-bg-warning-50 x-border-1 x-border-neutral-10">
          <div class="x-p-16 x-bg-auxiliary-50">layout item - Fake toolbar</div>
        </div>

        <div class="x-layout-item x-layout-overlap-from-top">
          <div class="x-justify-self-center x-mt-16">
            <button class="x-button x-button-sm x-button-accent">x-layout-overlap-from-top</button>
          </div>
        </div>

        <div class="x-scroll x-min-h-[500px]">
          <div class="x-layout-item x-bg-warning-50 x-border-1 x-border-neutral-10">
            <div class="x-bg-neutral-0 x-p-16">layout item inside scroll</div>
            <div class="x-flex x-flex-col x-bg-neutral-0">
              <div class="x-flex x-flex-col">
                <div
                  v-for="index in 15"
                  :key="index"
                  class="x-flex x-flex-row x-flex-wrap x-justify-between x-p-16"
                >
                  <div class="x-title2">I'm a title</div>
                  <div class="x-mb-16">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </div>
                  <button class="x-button x-button-primary">Hover me!</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="x-layout-item x-bg-warning-50 x-border-1 x-border-neutral-10">
          <div class="x-bg-success-50 x-p-16">layout item - Fake NQ grid</div>
          <div class="x-flex x-flex-col x-bg-success-50">
            <div class="x-flex x-flex-row">
              <div
                v-for="index in 5"
                :key="index"
                class="x-flex x-flex-row x-flex-wrap x-justify-between x-p-16"
              >
                <div class="x-title2">I'm a title</div>
                <div class="x-mb-16">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                  unknown printer took a galley of type and scrambled it to make a type specimen
                  book.
                </div>
                <button class="x-button x-button-primary">Hover me!</button>
              </div>
            </div>

            <button class="x-button x-button-secondary x-self-center x-mt-24 x-mx-auto">
              see more
            </button>
          </div>
        </div>

        <div class="x-layout-item x-bg-warning-50 x-border-1 x-border-neutral-10">
          <div class="x-bg-neutral-0 x-p-16">layout item - Fake result grid</div>
          <div class="x-flex x-flex-col x-bg-neutral-0">
            <div class="x-flex x-flex-row">
              <div
                v-for="index in 5"
                :key="index"
                class="x-flex x-flex-row x-flex-wrap x-justify-between x-p-16"
              >
                <div class="x-title2">I'm a title</div>
                <div class="x-mb-16">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </div>
                <button class="x-button x-button-primary">Hover me!</button>
              </div>
            </div>
          </div>
        </div>

        <div class="x-layout-item x-layout-overlap">
          <div class="x-layout-on-margin-right x-mb-16 x-mr-16">
            <button class="x-button x-button-sm x-button-circle x-button-accent">▲</button>
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
    @Prop({ default: 'x-layout-container x-layout-min-margin-32' })
    public base!: string;

    @Prop({ default: () => ['x-layout-sm', 'x-layout-md', 'x-layout-lg', 'x-layout-full'] })
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
  .modal {
    height: 100vh;
    min-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }
</style>
