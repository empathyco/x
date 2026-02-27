<template>
  <Wrapper feature="Icon" :rows="rows">
    <template #default>
      <div class="xds:flex xds:flex-row xds:gap-2">
        <component :is="icon" v-for="(icon, i) in iconComponents" :key="i" class="xds:icon" />
      </div>
    </template>
    <template #size>
      <div
        v-for="size in ['xds:icon-sm', 'xds:icon-md', 'xds:icon-lg', 'xds:icon-xl']"
        :key="size"
        class="xds:flex xds:flex-col xds:gap-2"
      >
        <h3 class="text-xs">{{ size }}</h3>
        <div class="xds:flex xds:flex-row xds:gap-2">
          <component
            :is="icon"
            v-for="(icon, i) in iconComponents"
            :key="i"
            class="xds:icon"
            :class="[size]"
          />
        </div>
      </div>
    </template>
    <template #color>
      <div class="xds:flex xds:flex-row xds:gap-16 xds:flex-wrap">
        <template v-for="colorClass in colorClasses" :key="colorClass">
          <div class="xds:flex xds:flex-col xds:gap-2">
            <h3 class="xds:text-xs">xds:icon-{{ colorClass }}</h3>
            <div class="xds:flex xds:flex-row xds:gap-2">
              <component
                :is="icon"
                v-for="(icon, i) in iconComponents"
                :key="i"
                class="xds:icon"
                :class="`xds:icon-${colorClass}`"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
    <template #background-color>
      <div class="xds:flex xds:flex-row xds:gap-16 xds:flex-wrap">
        <template v-for="colorClass in colorClasses" :key="colorClass">
          <div class="xds:flex xds:flex-col xds:gap-2">
            <h3 class="xds:text-xs">xds:icon-bg-{{ colorClass }}</h3>
            <div class="xds:flex xds:flex-row xds:gap-2">
              <component
                :is="icon"
                v-for="(icon, i) in iconComponents"
                :key="i"
                class="xds:icon"
                :class="`xds:icon-bg-${colorClass}`"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
    <template #sharp>
      <div class="xds:flex xds:flex-row xds:gap-2">
        <component
          :is="icon"
          v-for="(icon, i) in iconComponents"
          :key="i"
          class="xds:icon xds:icon-sharp"
        />
      </div>
    </template>
    <template #stroke-width>
      <div
        v-for="size in [
          'xds:icon-stroke-width-sm',
          'xds:icon-stroke-width-md',
          'xds:icon-stroke-width-lg',
          'xds:icon-stroke-width-xl',
        ]"
        :key="size"
        class="xds:flex xds:flex-col xds:gap-2"
      >
        <h3 class="text-xs">{{ size }}</h3>
        <div class="xds:flex xds:flex-row xds:gap-2">
          <component
            :is="icon"
            v-for="(icon, i) in iconComponents"
            :key="i"
            class="xds:icon"
            :class="[size]"
          />
        </div>
      </div>
    </template>
    <template #combinations>
      <div class="xds:flex xds:flex-row xds:gap-16 xds:flex-wrap">
        <div class="xds:flex xds:flex-col xds:gap-2">
          <h3 class="text-xs">lead xl stroke-width-lg sharp</h3>
          <div class="xds:flex xds:flex-row xds:gap-2">
            <component
              :is="icon"
              v-for="(icon, i) in iconComponents"
              :key="i"
              class="xds:icon xds:icon-lead xds:icon-xl xds:icon-stroke-width-lg xds:icon-sharp"
            />
          </div>
        </div>
        <div class="xds:flex xds:flex-col xds:gap-2">
          <h3 class="text-xs">lead xl stroke-width-lg sharp</h3>
          <div class="xds:flex xds:flex-row xds:gap-2">
            <component
              :is="icon"
              v-for="(icon, i) in iconComponents"
              :key="i"
              class="xds:icon xds:icon-error xds:icon-bg-warning xds:icon-lg"
            />
          </div>
        </div>
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import CheckAlt from './icons/check-alt.svg'
import CheckFill from './icons/check-fill.svg'
import Check from './icons/check.svg'
import CuratedFill from './icons/curated-fill.svg'
import Curated from './icons/curated.svg'
import Option from './icons/option.svg'
import Wrapper from './wrapper.vue'

const iconComponents = [Check, CheckFill, Curated, CuratedFill, Option, CheckAlt]

const rows = [
  'default',
  'size',
  'color',
  'background-color',
  'sharp',
  'stroke-width',
  'combinations',
]

/*
  Tailwind safelist classes:
  xds:icon-neutral xds:icon-neutral-0 xds:icon-neutral-10 xds:icon-neutral-25 xds:icon-neutral-50 xds:icon-neutral-75 xds:icon-neutral-90 xds:icon-neutral-100
  xds:icon-lead xds:icon-lead-25 xds:icon-lead-50 xds:icon-lead-75
  xds:icon-auxiliary xds:icon-auxiliary-25 xds:icon-auxiliary-50 xds:icon-auxiliary-75
  xds:icon-accent xds:icon-accent-25 xds:icon-accent-50 xds:icon-accent-75
  xds:icon-highlight xds:icon-highlight-25 xds:icon-highlight-50 xds:icon-highlight-75
  xds:icon-success xds:icon-success-25 xds:icon-success-50 xds:icon-success-75
  xds:icon-warning xds:icon-warning-25 xds:icon-warning-50 xds:icon-warning-75
  xds:icon-error xds:icon-error-25 xds:icon-error-50 xds:icon-error-75
  xds:icon-bg-neutral xds:icon-bg-neutral-0 xds:icon-bg-neutral-10 xds:icon-bg-neutral-25 xds:icon-bg-neutral-50 xds:icon-bg-neutral-75 xds:icon-bg-neutral-90 xds:icon-bg-neutral-100
  xds:icon-bg-lead xds:icon-bg-lead-25 xds:icon-bg-lead-50 xds:icon-bg-lead-75
  xds:icon-bg-auxiliary xds:icon-bg-auxiliary-25 xds:icon-bg-auxiliary-50 xds:icon-bg-auxiliary-75
  xds:icon-bg-accent xds:icon-bg-accent-25 xds:icon-bg-accent-50 xds:icon-bg-accent-75
  xds:icon-bg-highlight xds:icon-bg-highlight-25 xds:icon-bg-highlight-50 xds:icon-bg-highlight-75
  xds:icon-bg-success xds:icon-bg-success-25 xds:icon-bg-success-50 xds:icon-bg-success-75
  xds:icon-bg-warning xds:icon-bg-warning-25 xds:icon-bg-warning-50 xds:icon-bg-warning-75
  xds:icon-bg-error xds:icon-bg-error-25 xds:icon-bg-error-50 xds:icon-bg-error-75
*/

const variantColors = {
  neutral: [0, 10, 25, 50, 75, 90, 100],
  lead: [25, 50, 75],
  auxiliary: [25, 50, 75],
  accent: [25, 50, 75],
  highlight: [25, 50, 75],
  success: [25, 50, 75],
  warning: [25, 50, 75],
  error: [25, 50, 75],
}

const colorClasses = [
  ...Object.entries(variantColors).flatMap(([color, variants]) => [
    `${color}`,
    ...variants.map(variant => `${color}-${variant}`),
  ]),
]
</script>
