<template>
  <Wrapper feature="Button" :rows="rows">
    <template #default>
      <div class="xds:flex xds:flex-wrap xds:gap-5">
        <div class="xds:button-group">
          <button class="xds:button">BUTTON 1</button>
          <button class="xds:button">BUTTON 2</button>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8">
          <button class="xds:button">BUTTON 1</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button">BUTTON 2</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group">
          <button class="xds:button xds:button-outlined">BUTTON 1</button>
          <button class="xds:button xds:button-outlined">BUTTON 2</button>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8">
          <button class="xds:button xds:button-outlined">BUTTON 1</button>
          <button class="xds:button xds:button-outlined">BUTTON 2</button>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8">
          <button class="xds:button xds:button-outlined">BUTTON 1</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button xds:button-outlined">BUTTON 2</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:text-red-500">
          <button class="xds:button xds:button-ghost">BUTTON 1</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button xds:button-ghost">BUTTON 2</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button xds:button-ghost xds:button-warning">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8 xds:text-red-500">
          <button class="xds:button xds:button-tight">BUTTON 1</button>
          <button class="xds:button xds:button-tight">BUTTON 2</button>
          <button class="xds:button xds:button-tight xds:button-warning">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:text-red-500">
          <button class="xds:button xds:button-highlight xds:button-circle">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="xds:button xds:button-ghost xds:button-success xds:button-square">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="xds:button-group xds:text-red-500">
          <button class="xds:button xds:button-highlight xds:button-square">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="xds:button xds:button-ghost xds:button-success xds:button-square">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </template>
    <template #rounded>
      <div class="xds:flex xds:flex-wrap xds:gap-5 xds:rounded-xl">
        <div class="xds:button-group">
          <button class="xds:button">BUTTON 1</button>
          <button class="xds:button">BUTTON 2</button>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8 xds:rounded-xl">
          <button class="xds:button">BUTTON 1</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button">BUTTON 2</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:rounded-xl">
          <button class="xds:button xds:button-outlined">BUTTON 1</button>
          <button class="xds:button xds:button-outlined">BUTTON 2</button>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8 xds:rounded-xl">
          <button class="xds:button xds:button-outlined">BUTTON 1</button>
          <button class="xds:button xds:button-outlined">BUTTON 2</button>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8 xds:rounded-xl">
          <button class="xds:button xds:button-outlined">BUTTON 1</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button xds:button-outlined">BUTTON 2</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:text-red-500 xds:rounded-xl">
          <button class="xds:button xds:button-ghost">BUTTON 1</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button xds:button-ghost">BUTTON 2</button>
          <span class="xds:button-group-divider"></span>
          <button class="xds:button xds:button-ghost xds:button-warning">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:gap-8 xds:text-red-500">
          <button class="xds:button xds:button-tight">BUTTON 1</button>
          <button class="xds:button xds:button-tight">BUTTON 2</button>
          <button class="xds:button xds:button-tight xds:button-warning">BUTTON 3</button>
        </div>
        <div class="xds:button-group xds:text-red-500 xds:rounded-xl">
          <button class="xds:button xds:button-highlight xds:button-circle">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="xds:button xds:button-ghost xds:button-success xds:button-square">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="xds:button-group xds:text-red-500 xds:rounded-xl">
          <button class="xds:button xds:button-highlight xds:button-square">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="xds:button xds:button-ghost xds:button-success xds:button-square">
            <svg
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="xds:size-12"
            >
              <path
                d="M4 1.5V6.5M1.5 4H6.5"
                stroke="currentColor"
                stroke-width="0.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="xds:button-group xds:rounded-xl">
        <button class="xds:button">BUTTON 1</button>
        <button class="xds:button">BUTTON 2</button>
        <button class="xds:button">BUTTON 3</button>
      </div>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default', 'rounded']
</script>
