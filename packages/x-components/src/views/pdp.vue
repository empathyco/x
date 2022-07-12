<template>
  <div>
    <Tagging />
    <button @click="addProductToCart" data-test="pdp-add-to-cart-button" class="x-button">
      Add product to cart
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Tagging } from '../x-modules/tagging';

  @Component({
    components: {
      Tagging
    }
  })
  export default class Pdp extends Vue {
    addProductToCart(): void {
      window.InterfaceX?.addProductToCart();
    }
  }
</script>

<style scoped></style>
