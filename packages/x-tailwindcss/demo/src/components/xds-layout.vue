<template>
  <XdsBaseShowcase
    #default="{ cssClass, copyCssClassesToClipboard }"
    title="Layout"
    :sections="sections"
  >
    <button @click="openModal" class="x-button">One Column Layout</button>

    <dialog ref="modal" class="modal">
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
        <div v-for="(item, index) in items" :key="index" :class="item.class">
          <div>{{ item.title }} - {{ index }}</div>
          <div v-if="item.content" class="x-flex">
            <div
              v-for="(card, index) in item.content"
              :key="index"
              class="x-flex x-flex-row x-flex-wrap x-justify-between x-p-16"
              :class="item.background"
            >
              <div class="x-title2">{{ card.title }}</div>
              <div class="x-mb-16">{{ card.text }}</div>
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
    @Prop({ default: 'x-layout-container x-bg-neutral-50 x-layout-sm x-layout-min-margin-48' })
    public base!: string;

    @Prop({
      default: () => [
        {
          class: 'x-layout-item x-p-16 x-bg-accent-50',
          title: 'layout item - Fake toolbar'
        },
        {
          class: 'x-layout-item x-p-16 x-bg-neutral-0',
          background: 'x-bg-neutral-0',
          title: 'layout item - Fake result grid',
          content: [
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            }
          ]
        },
        {
          class: 'x-layout-item x-p-16 x-bg-warning-50',
          background: 'x-bg-warning-25 x-mt-16',
          title: 'layout item - Fake NQ grid',
          button: 'see more',
          content: [
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
            }
          ]
        },
        {
          class: 'x-layout-item x-p-16 x-bg-neutral-0',
          background: 'x-bg-neutral-0',
          title: 'layout item - Fake result grid',
          content: [
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            },
            {
              title: "I'm a title",
              // eslint-disable-next-line max-len
              text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            }
          ]
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
</style>
