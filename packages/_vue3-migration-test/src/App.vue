<template>
  <div id="app">
    <h1>vue3-migration-test</h1>
    <h2>without module</h2>
    <h3>animations</h3>
    <div style="height: 6rem">
      <h4>animate-width</h4>
      <button @click="animateWidthToggled = !animateWidthToggled">Toggle</button>
      <AnimateWidth>
        <p v-if="animateWidthToggled" style="width: 300px; white-space: nowrap">
          Element to animate
        </p>
      </AnimateWidth>
    </div>
    <div style="height: 6rem">
      <h4>cross-fade</h4>
      <button @click="crossFadeToggled = !crossFadeToggled">Toggle</button>
      <CrossFade>
        <p v-if="!crossFadeToggled">Element to animate</p>
      </CrossFade>
    </div>
    <div style="height: 6rem">
      <h4>fade</h4>
      <button @click="fadeToggled = !fadeToggled">Toggle</button>
      <Fade>
        <p v-if="fadeToggled">Element to animate</p>
      </Fade>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { AnimateWidth, CrossFade, Fade } from './';

  export default defineComponent({
    name: 'App',
    components: {
      AnimateWidth,
      CrossFade,
      Fade
    },
    setup: function () {
      const animateWidthToggled = ref(false);
      const crossFadeToggled = ref(false);
      const fadeToggled = ref(false);

      return {
        animateWidthToggled,
        crossFadeToggled,
        fadeToggled
      };
    }
  });
</script>
