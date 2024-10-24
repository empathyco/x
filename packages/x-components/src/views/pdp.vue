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
  import { defineComponent, ref } from 'vue';
  import { use$x } from '../composables/use-$x';
  import { XEvent } from '../wiring';
  import { Tagging } from '../x-modules/tagging';

  export default defineComponent({
    components: {
      Tagging
    },
    setup() {
      const $x = use$x();

      const addProductToCart = (): void => window.InterfaceX?.addProductToCart();

      const showAddToCartButton = ref(false);
      setTimeout(() => {
        const events: XEvent[] = ['ResultURLTrackingEnabled', 'PDPIsLoaded'];
        events.forEach(event =>
          $x.on(event, false).subscribe(() => (showAddToCartButton.value = true))
        );
      }, 500); // emulate loading time for customer PDP

      return {
        addProductToCart,
        showAddToCartButton
      };
    }
  });
</script>
