<template>
  <Wrapper feature="Tabs" :rows="rows">
    <template #default>
      <nav class="xds:tabs" role="tablist">
        <button class="xds:selected xds:tab" role="tab" aria-selected="true">First</button>
        <button class="xds:tab" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab" role="tab" aria-selected="false">Third</button>
      </nav>
    </template>
    <template #size>
      <nav
        v-for="size in sizes"
        :key="size.name"
        class="xds:tabs xds:tabs-underline"
        role="tablist"
      >
        <button class="xds:selected xds:tab" :class="size.class" role="tab" aria-selected="true">
          {{ size.name }} tab
        </button>
        <button class="xds:tab" :class="size.class" role="tab" aria-selected="false">
          {{ size.name }} tab
        </button>
      </nav>
    </template>
    <template #underline>
      <nav class="xds:tabs xds:tabs-underline" role="tablist">
        <button class="xds:selected xds:tab xds:tab-underline" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Second</button>
        <span class="xds:tabs-divider" />
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Third</button>
      </nav>
    </template>
    <template #pill>
      <nav class="xds:tabs xds:tabs-pill" role="tablist">
        <button class="xds:selected xds:tab xds:tab-pill" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Third</button>
      </nav>
    </template>
    <template #boxed>
      <div class="xds:w-320">
        <nav class="xds:tabs-boxed xds:tabs" role="tablist">
          <button class="xds:selected xds:tab xds:tab-boxed" role="tab" aria-selected="true">
            First
          </button>
          <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Second</button>
          <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Third</button>
        </nav>
        <div class="xds:border-1 xds:border-t-0 xds:border-neutral-25 xds:p-16">
          Tab panel content
        </div>
      </div>
    </template>
    <template #vertical>
      <nav class="xds:tabs-vertical xds:tabs xds:w-192 xds:tabs-underline" role="tablist">
        <button class="xds:selected xds:tab xds:tab-underline" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Third</button>
      </nav>
      <nav class="xds:tabs-vertical xds:tabs xds:w-192 xds:tabs-pill" role="tablist">
        <button class="xds:selected xds:tab xds:tab-pill" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Third</button>
      </nav>
      <nav class="xds:tabs-vertical xds:tabs-boxed xds:tabs xds:w-192" role="tablist">
        <button class="xds:selected xds:tab xds:tab-boxed" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Third</button>
      </nav>
    </template>
    <template #disabled>
      <nav class="xds:tabs xds:tabs-underline" role="tablist">
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false" disabled>
          underline tab
        </button>
        <button
          class="xds:selected xds:tab xds:tab-underline"
          role="tab"
          aria-selected="true"
          disabled
        >
          selected underline tab
        </button>
      </nav>
      <nav class="xds:tabs xds:tabs-pill" role="tablist">
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false" disabled>
          pill tab
        </button>
        <button class="xds:selected xds:tab xds:tab-pill" role="tab" aria-selected="true" disabled>
          selected pill tab
        </button>
      </nav>
      <nav class="xds:tabs-boxed xds:tabs" role="tablist">
        <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false" disabled>
          boxed tab
        </button>
        <button class="xds:selected xds:tab xds:tab-boxed" role="tab" aria-selected="true" disabled>
          selected boxed tab
        </button>
      </nav>
    </template>
    <template #combinations>
      <nav class="xds:tabs xds:tabs-pill" role="tablist">
        <button
          class="xds:selected xds:tab xds:tab-pill xds:tab-accent"
          role="tab"
          aria-selected="true"
        >
          accent tab
        </button>
        <button class="xds:tab xds:tab-pill xds:tab-accent" role="tab" aria-selected="false">
          accent tab
        </button>
      </nav>
      <div class="xds:tabs-boxed xds:tabs" role="tablist">
        <button
          class="xds:selected xds:tab xds:tab-lg xds:tab-boxed"
          role="tab"
          aria-selected="true"
        >
          lg boxed tab
        </button>
        <button class="xds:tab xds:tab-lg xds:tab-boxed" role="tab" aria-selected="false">
          lg boxed tab
        </button>
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = [
  'default',
  'size',
  'underline',
  'pill',
  'boxed',
  'vertical',
  'disabled',
  'combinations',
]

const sizes = [
  { name: 'sm', class: 'xds:tab-sm' },
  { name: 'md', class: 'xds:tab-md' },
  { name: 'lg', class: 'xds:tab-lg' },
]
</script>
