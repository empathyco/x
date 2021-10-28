<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Facet</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>

      <div class="x-facet">
        <button>
          <span>Facet title</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <span>Facet title Extra Large Name</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title Extra Large Name</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-facet--outlined">
      <h2 class="x-title2">Outlined</h2>

      <div class="x-facet">
        <button>
          <span>Facet title</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <span>Facet title Extra Large Name</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title Extra Large Name</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-facet--line">
      <h2 class="x-title2">Line</h2>

      <div class="x-facet">
        <button>
          <span>Facet title</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <span>Facet title Extra Large Name</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title Extra Large Name</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-facet--card">
      <h2 class="x-title2">Card</h2>

      <div class="x-facet">
        <button>
          <span>Facet title</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <span>Facet title Extra Large Name</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet">
        <button>
          <ChevronDownIcon />
          <span>Facet title Extra Large Name</span>
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Combinations</h2>

      <div class="x-facet x-facet--outlined x-facet--line">
        <button>
          <span>Facet Outlined + Line</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet x-facet--outlined x-facet--card">
        <button>
          <span>Facet Outlined + Card</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet x-facet--line x-facet--card">
        <button>
          <span>Facet Line + Card</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>

      <div class="x-facet x-facet--outlined x-facet--line x-facet--card">
        <button>
          <span>Facet Outlined + Line + Card</span>
          <ChevronDownIcon />
        </button>
        <div>
          <pre style="height: 100%; text-align: center; vertical-align: center">&lt;slot&gt;</pre>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ChevronDownIcon from '../../components/icons/chevron-down.vue';

  @Component({ components: { ChevronDownIcon } })
  export default class DesignSystemFacet extends Vue {}
</script>

<style lang="scss" scoped>
  .x-facet {
    max-width: 220px;
  }

  .x-facet--card {
    --x-color-background-facet-default: var(--x-color-base-neutral-95);
  }
</style>
