<template>
  <div>
    <dialog ref="modal" class="modal">
      <div class="x-layout-container x-layout-max-width-md x-layout-min-margin-32 x-bg-warning-25">
        <div class="x-layout-item">
          <div
            class="
              x-flex x-justify-between x-bg-accent-25 x-border-accent-50 x-border-solid x-border-b-1
            "
          >
            <span>
              This is inside a
              <code>x-layout-item</code>
            </span>
            <form method="dialog">
              <button @click="enablescroll" class="x-button x-button-ghost" value="default">
                Close
              </button>
            </form>
          </div>
          <span class="x-bg-accent-25">
            This is inside the same
            <code>x-layout-item</code>
          </span>
        </div>
        <div class="x-bg-lead-25">
          This is not inside a
          <code>x-layout-item</code>
        </div>
        <div class="x-scroll">
          <div class="x-layout-item x-bg-neutral-10">
            <div class="x-flex x-flex-col x-justify-between x-bg-auxiliary-25 x-h-[2000px]">
              <span>
                this is inside another
                <code>x-layout-item</code>
                which is inside the scroll
              </span>
              <span class="x-place-self-center">
                this is inside the same last
                <code>x-layout-item</code>
                which is still inside the scroll
              </span>
              <span class="x-place-self-end">
                this also is inside the same last
                <code>x-layout-item</code>
                which is inside the scroll
              </span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
    <button @click="openModal" class="x-button">Open</button>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class XdsLayout extends Vue {
    openModal(): void {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      (this.$refs.modal as any).showModal();
      document.documentElement.style.overflow = 'hidden';
    }

    enablescroll(): void {
      document.documentElement.style.overflow = '';
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
