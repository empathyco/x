<template>
  <div>
    <Tagging />
    <button
      v-if="showAddToCartButton"
      @click="addProductToCart"
      data-test="pdp-add-to-cart-button"
      class="x-button"
    >
      Add product to cart
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onUnmounted, ref } from 'vue';
  import { use$x } from '../composables/use-$x';
  import { Tagging } from '../x-modules/tagging';

  export default defineComponent({
    components: {
      Tagging
    },
    setup() {
      const $x = use$x();

      const addProductToCart = (): void => window.InterfaceX?.addProductToCart();

      const showAddToCartButton = ref(false);
      const subscription = $x
        .on('ResultURLTrackingEnabled')
        .subscribe(() => (showAddToCartButton.value = true));

      onUnmounted(() => subscription.unsubscribe());

      return {
        addProductToCart,
        showAddToCartButton
      };
    }
  });
</script>

<style scoped></style>
