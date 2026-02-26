<template>
  <Wrapper feature="Button Group" :rows="rows">
    <template v-for="row in rows" #[row] :key="row">
      <div class="xds:button-group" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button v-for="i in 3" :key="i" class="xds:button">BUTTON {{ i }}</button>
      </div>
      <div class="xds:button-group xds:gap-8" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button">BUTTON 1</button>
        <span class="xds:button-group-divider" />
        <button class="xds:button">BUTTON 2</button>
        <span class="xds:button-group-divider" />
        <button class="xds:button">BUTTON 3</button>
      </div>
      <div class="xds:button-group" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-outlined">BUTTON 1</button>
        <button class="xds:button xds:button-outlined">BUTTON 2</button>
        <button class="xds:button">BUTTON 3</button>
      </div>
      <div class="xds:button-group xds:gap-8" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-outlined">BUTTON 1</button>
        <button class="xds:button xds:button-outlined">BUTTON 2</button>
        <button class="xds:button">BUTTON 3</button>
      </div>
      <div class="xds:button-group xds:gap-8" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-outlined">BUTTON 1</button>
        <span class="xds:button-group-divider" />
        <button class="xds:button xds:button-outlined">BUTTON 2</button>
        <span class="xds:button-group-divider" />
        <button class="xds:button">BUTTON 3</button>
      </div>
      <div class="xds:button-group" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-ghost">BUTTON 1</button>
        <span class="xds:button-group-divider" />
        <button class="xds:button xds:button-ghost">BUTTON 2</button>
        <span class="xds:button-group-divider" />
        <button class="xds:button xds:button-ghost xds:button-warning">BUTTON 3</button>
      </div>
      <div class="xds:button-group xds:gap-8" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-tight">BUTTON 1</button>
        <button class="xds:button xds:button-tight">BUTTON 2</button>
        <button class="xds:button xds:button-tight xds:button-warning">BUTTON 3</button>
      </div>
      <div class="xds:button-group" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-highlight xds:button-circle">
          <PlusIcon class="xds:icon" />
        </button>
        <button class="xds:button xds:button-ghost xds:button-success xds:button-square">
          <PlusIcon class="xds:icon" />
        </button>
      </div>
      <div class="xds:button-group" :class="{ 'xds:rounded-xl': row === 'rounded' }">
        <button class="xds:button xds:button-highlight xds:button-square">
          <PlusIcon class="xds:icon" />
        </button>
        <button class="xds:button xds:button-ghost xds:button-success xds:button-square">
          <PlusIcon class="xds:icon" />
        </button>
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import PlusIcon from './icons/plus.svg'
import Wrapper from './wrapper.vue'

const rows = ['default', 'rounded']
</script>
