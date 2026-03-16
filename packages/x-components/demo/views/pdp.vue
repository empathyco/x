<template>
  <div>
    <Tagging />
    <button
      v-if="showAddToCartButton"
      data-test="pdp-add-to-cart-button"
      class="x-button"
      @click="addProductToCart"
    >
      Add product to cart
    </button>
  </div>
</template>

<script lang="ts">
import type { XEvent } from '@x/wiring'
import { use$x } from '@x/composables'
import { Tagging } from '@x/x-modules/tagging'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {
    Tagging,
  },
  setup() {
    const $x = use$x()

    const addProductToCart = (): void => window.InterfaceX?.addProductToCart()

    const showAddToCartButton = ref(false)
    setTimeout(() => {
      const events: XEvent[] = ['ResultURLTrackingEnabled', 'PDPIsLoaded']
      events.forEach(event =>
        $x.on(event, false).subscribe(() => (showAddToCartButton.value = true)),
      )
    }, 500) // emulate loading time for customer PDP

    return {
      addProductToCart,
      showAddToCartButton,
    }
  },
})
</script>
