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
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="item.class"
          class="x-bg-error-50 x-border-1 x-border-neutral-10"
        >
          <div :class="item.backgroundContent" class="x-p-16">{{ item.title }}</div>
          <div v-if="item.content" class="x-flex x-flex-col" :class="item.backgroundContent">
            <div class="x-flex x-flex-row">
              <div
                v-for="index in 5"
                :key="index"
                class="x-flex x-flex-row x-flex-wrap x-justify-between x-p-16"
              >
                <div class="x-title2">{{ item.content.title }}</div>
                <div class="x-mb-16">{{ item.content.text }}</div>
                <button class="x-button x-button-primary">Hover me!</button>
              </div>
            </div>

            <button
              v-if="item.button"
              class="x-button x-button-secondary x-self-center x-mt-24 x-mx-auto"
            >
              {{ item.button }}
            </button>
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

    @Prop({ default: () => ['x-layout-sm', 'x-layout-md', 'x-layout-lg', 'x-layout-full'] })
    public sizes!: string[];

    public items: Record<string, unknown>[] = [
      {
        class: 'x-layout-item',
        backgroundContent: 'x-bg-warning-50',
        title: 'layout item - Fake toolbar'
      },
      {
        class: 'x-layout-item',
        backgroundContent: 'x-bg-neutral-0',
        title: 'layout item - Fake result grid',
        content: {
          title: "I'm a title",
          // eslint-disable-next-line max-len
          text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        }
      },
      {
        class: 'x-layout-item',
        backgroundContent: 'x-bg-success-50',
        title: 'layout item - Fake NQ grid',
        button: 'see more',
        content: {
          title: "I'm a title",
          // eslint-disable-next-line max-len
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        }
      },
      {
        class: 'x-layout-item',
        backgroundContent: 'x-bg-neutral-0',
        title: 'layout item - Fake result grid',
        content: {
          title: "I'm a title",
          // eslint-disable-next-line max-len
          text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        }
      }
    ];

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
    min-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }
</style>
