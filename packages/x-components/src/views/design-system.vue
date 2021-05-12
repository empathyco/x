<template>
  <main>
    <section>
      <h1 class="x-title1">Typography</h1>

      <span class="x-text">text typography</span>
      <span class="x-title1">Title1 Typography</span>
      <span class="x-title2">Title2 Typography</span>
      <span class="x-title3">Title3 Typography</span>
      <span class="x-small">small typography</span>
    </section>

    <section>
      <h1 class="x-title1">Button</h1>

      <article>
        <h2 class="x-title2">Default</h2>
        <button class="x-button">Default</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          Default
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          Default Card
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          Default Pill
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--primary">
        <h2 class="x-title2">Primary</h2>
        <button class="x-button">Primary</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          Primary
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          Primary Card
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          Primary Pill
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--secondary">
        <h2 class="x-title2">Secondary</h2>
        <button class="x-button">Secondary</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          Secondary
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          Secondary Card
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          Secondary Pill
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--tertiary">
        <h2 class="x-title2">Tertiary</h2>
        <button class="x-button">Tertiary</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          Tertiary
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          Tertiary Card
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          Tertiary Pill
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>

      <article class="x-button--ghost">
        <h2 class="x-title2">Ghost</h2>
        <button class="x-button">Ghost</button>
        <button class="x-button">
          <span class="x-icon">⌕</span>
          Ghost
        </button>
        <button class="x-button x-button--card">
          <span class="x-icon">⌕</span>
          Ghost Card
        </button>
        <button class="x-button x-button--pill">
          <span class="x-icon">⌕</span>
          Ghost Pill
        </button>
        <button class="x-button x-button--round">
          <span class="x-icon">⌕</span>
        </button>
      </article>
    </section>

    <section>
      <h1 class="x-title1">Input</h1>

      <article>
        <h2 class="x-title2">Default</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>

      <article class="x-input--card">
        <h2 class="x-title2">Card</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>

      <article class="x-input--line">
        <h2 class="x-title2">Line</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>

      <article class="x-input--pill">
        <h2 class="x-title2">Pill</h2>
        <input type="text" class="x-input" placeholder="type here" />
      </article>
    </section>

    <section>
      <h1 class="x-title1">Input Group</h1>

      <article>
        <h2 class="x-title2">Default</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>

      <article class="x-input-group--pill">
        <h2 class="x-title2">Pill</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>

      <article class="x-input-group--card">
        <h2 class="x-title2">Card</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>

      <article class="x-input-group--line">
        <h2 class="x-title2">Line</h2>

        <div class="x-input-group">
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
        </div>

        <div class="x-input-group">
          <span class="x-icon x-input-group__action">⌕</span>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
          <button class="x-button x-button--secondary x-input-group__action">Search</button>
        </div>

        <div class="x-input-group">
          <button class="x-button x-button--tertiary x-input-group__action">
            <span class="x-icon">⌕</span>
          </button>
          <input type="text" class="x-input" placeholder="type here" />
          <button class="x-button">Clear</button>
        </div>
      </article>
    </section>

    <button @click="showTokens" class="info x-button x-button--tertiary x-button--round">i</button>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystem extends Vue {
    protected showTokens(): void {
      const styleElement = document.querySelector(`head style[type='text/css']`);
      const isShown = styleElement?.classList.contains('show-tokens');
      if (isShown) {
        styleElement?.classList.remove('show-tokens');
      } else {
        styleElement?.setAttribute('contenteditable', 'true');
        styleElement?.classList.add('show-tokens');
      }
    }
  }
</script>

<style lang="scss" scoped>
  * {
    outline: none;
  }
  section {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--x-space-04);
    padding: var(--x-space-07);
  }

  article {
    display: flex;
    gap: 15px;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;

    h2 {
      width: 100%;
    }
  }
</style>

<style lang="scss">
  .info {
    position: fixed;
    right: var(--x-space-08);
    bottom: var(--x-space-08);
  }
  head {
    display: block;
    visibility: hidden;

    .show-tokens {
      visibility: visible;
      display: block;
      position: fixed;
      background: lightgoldenrodyellow;
      padding: var(--x-space-04) var(--x-space-09);
      bottom: 0;
      right: 0;
      white-space: pre;
      height: 80%;
      overflow: auto;
      font-family: monospace;

      &:before {
        font-family: var(--x-font-family);
        content: 'You can edit here the Design Tokens';
        display: block;
        font-size: var(--x-font-size-xl);
        padding-bottom: 10px;
      }
    }
  }

  .x-input-group {
    width: 250px;
  }
</style>
