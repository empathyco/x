<template>
  <div>
    <dialog ref="modal" class="modal">
      <div class="x-layout-container x-layout-max-width-sm x-layout-min-margin-32 x-bg-warning-25">
        <div class="x-layout-item">
          <div
            class="
              x-flex
              x-justify-between
              x-bg-warning-50
              x-border-warning-75
              x-border-solid
              x-border-b-1
            "
          >
            <span>
              This is inside a
              <code>x-layout-item</code>
            </span>
            <form method="dialog">
              <button @click="enableScroll" class="x-button x-button-ghost" value="default">
                Close
              </button>
            </form>
          </div>
          <span class="x-bg-warning-50">
            This is inside the same
            <code>x-layout-item</code>
          </span>
        </div>
        <div class="x-bg-neutral-25">
          This is not inside a
          <code>x-layout-item</code>
        </div>
        <div class="x-layout-item x-no-margin-right x-layout-expand x-bg-success-50">
          <div class="x-flex x-layout-expand">
            <div class="x-scroll x-w-128">
              <div class="x-flex x-flex-col x-justify-between x-bg-auxiliary-50 x-h-[2000px]">
                <span>
                  this is inside another
                  <code>x-layout-item</code>
                  which is inside the scroll
                </span>
                <span class="x-place-self-end">
                  this also is inside the same last
                  <code>x-layout-item</code>
                  which is inside the scroll
                </span>
              </div>
            </div>
            <div class="x-scroll x-layout-expand x-flex-1">
              <div class="x-layout-item x-no-margin-left x-bg-auxiliary-25">
                <div class="x-flex x-flex-col x-justify-between x-bg-auxiliary-50 x-h-[2000px]">
                  <section>
                    this is inside another
                    <code>x-layout-item</code>
                    which is inside the scroll
                  </section>
                  <span class="x-place-self-end">
                    this also is inside the same last
                    <code>x-layout-item</code>
                    which is inside the scroll
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="x-layout-item x-overlap">
          <button class="x-button x-justify-self-center x-mb-16">This is overlapping</button>
          <button
            class="
              x-on-margin-right
              x-justify-self-start
              x-self-end
              x-button
              x-button-sm
              x-button-circle
              x-mb-16
            "
          >
            ▲
          </button>
        </div>
      </div>
    </dialog>
    <button @click="openModal" class="x-button">Open</button>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class XdsLayoutTwoCols extends Vue {
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

<style scoped>
  .modal {
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    padding: 0;
  }
</style>
