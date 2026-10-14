<template>
  <Wrapper feature="Tabs" :rows="rows">
    <template #default>
      <div class="xds:tabs" role="tablist">
        <button class="xds:selected xds:tab" role="tab" aria-selected="true">First</button>
        <button class="xds:tab" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab" role="tab" aria-selected="false">Third</button>
      </div>
    </template>
    <template #size>
      <div
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
      </div>
    </template>
    <template #underline>
      <div class="xds:tabs xds:tabs-underline" role="tablist">
        <button class="xds:selected xds:tab xds:tab-underline" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Second</button>
        <span class="xds:tabs-divider" />
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Third</button>
      </div>
    </template>
    <template #pill>
      <div class="xds:tabs xds:tabs-pill" role="tablist">
        <button class="xds:selected xds:tab xds:tab-pill" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Third</button>
      </div>
    </template>
    <template #boxed>
      <div class="xds:w-320">
        <div class="xds:tabs-boxed xds:tabs" role="tablist">
          <button class="xds:selected xds:tab xds:tab-boxed" role="tab" aria-selected="true">
            First
          </button>
          <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Second</button>
          <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Third</button>
        </div>
        <div class="xds:border-1 xds:border-t-0 xds:border-neutral-25 xds:p-16">
          Tab panel content
        </div>
      </div>
    </template>
    <template #vertical>
      <div class="xds:tabs-vertical xds:tabs xds:tabs-underline xds:w-192" role="tablist">
        <button class="xds:selected xds:tab xds:tab-underline" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">Third</button>
      </div>
      <div class="xds:tabs-vertical xds:tabs xds:tabs-pill xds:w-192" role="tablist">
        <button class="xds:selected xds:tab xds:tab-pill" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false">Third</button>
      </div>
      <div class="xds:tabs-vertical xds:tabs-boxed xds:tabs xds:w-192" role="tablist">
        <button class="xds:selected xds:tab xds:tab-boxed" role="tab" aria-selected="true">
          First
        </button>
        <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Second</button>
        <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false">Third</button>
      </div>
    </template>
    <template #disabled>
      <div class="xds:tabs xds:tabs-underline" role="tablist">
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
      </div>
      <div class="xds:tabs xds:tabs-pill" role="tablist">
        <button class="xds:tab xds:tab-pill" role="tab" aria-selected="false" disabled>
          pill tab
        </button>
        <button class="xds:selected xds:tab xds:tab-pill" role="tab" aria-selected="true" disabled>
          selected pill tab
        </button>
      </div>
      <div class="xds:tabs-boxed xds:tabs" role="tablist">
        <button class="xds:tab xds:tab-boxed" role="tab" aria-selected="false" disabled>
          boxed tab
        </button>
        <button class="xds:selected xds:tab xds:tab-boxed" role="tab" aria-selected="true" disabled>
          selected boxed tab
        </button>
      </div>
    </template>
    <template #combinations>
      <div class="xds:tabs xds:tabs-underline" role="tablist">
        <button class="xds:selected xds:tab xds:tab-underline" role="tab" aria-selected="true">
          <CuratedIcon class="xds:icon" />
          curated
        </button>
        <button class="xds:tab xds:tab-underline" role="tab" aria-selected="false">
          <CuratedIcon class="xds:icon" />
          trending
        </button>
      </div>
      <div class="xds:tabs xds:tabs-pill" role="tablist">
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
      </div>
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
import CuratedIcon from './icons/curated.svg'
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
