<template>
  <div class="x-base-slider">
    <div ref="slider" class="x-slider" />
    <div class="x-base-slider-selected">
      <slot :rangeSelected="rangeSelected">
        <p class="x-base-slider-selected-min">
          <span>min value</span>
          <span>
            {{ rangeSelected[0] }}
          </span>
        </p>
        <p class="x-base-slider-selected-max">
          <span>max value</span>
          <span>
            {{ rangeSelected[1] }}
          </span>
        </p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { API, create } from 'nouislider';
  import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue';

  export default defineComponent({
    name: 'BaseSlider',
    components: {},
    props: {
      threshold: {
        type: Object as PropType<{ min: number; max: number }>,
        default: () => ({ min: 0, max: Number.MAX_SAFE_INTEGER })
      },
      modelValue: {
        type: Object as PropType<{ min: number; max: number }>,
        required: true
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      let sliderInstance: API;
      const slider = ref<HTMLElement>();

      const minSelected = ref(props.modelValue?.min ?? props.threshold.min);
      const maxSelected = ref(props.modelValue?.max ?? props.threshold.max);

      const rangeSelected = computed(() => [minSelected.value, maxSelected.value]);
      const slideRange = computed(() => ({ min: props.threshold.min, max: props.threshold.max }));

      onMounted(() => {
        sliderInstance = create(slider.value!, {
          start: rangeSelected.value,
          range: slideRange.value,
          step: 1,
          connect: true,
          margin: 1
        });

        sliderInstance.on('update', ([min, max]) => {
          minSelected.value = Number(min);
          maxSelected.value = Number(max);
        });

        sliderInstance.on('change', () =>
          emit('update:modelValue', { min: minSelected.value, max: maxSelected.value })
        );
      });

      onUnmounted(() => {
        // Waiting to finish the collapse animation before destroying it
        setTimeout(sliderInstance.destroy.bind(sliderInstance), 600);
      });

      watch(
        () => props.threshold,
        ({ min, max }) => {
          sliderInstance.updateOptions({ range: slideRange.value, start: [min, max] }, false);
          emit('update:modelValue', { min, max });
        }
      );

      return {
        slider,
        rangeSelected
      };
    }
  });
</script>

<style lang="css">
  @import 'nouislider/dist/nouislider.css';

  .x-base-slider {
    gap: 15px;
  }

  .x-base-slider,
  .x-base-slider-selected-min,
  .x-base-slider-selected-max {
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    flex-flow: column nowrap;
  }

  .x-base-slider-selected {
    display: inline-flex;
    gap: 5px;
  }

  .x-base-slider-selected-min,
  .x-base-slider-selected-max {
    flex: 50%;
    gap: 8px;
  }

  .x-slider {
    height: 4px;
    padding: 0 15px;
    margin: 15px 0;
    background: #e0e0e0;
    border: none;
    box-shadow: none;
    cursor: pointer;
  }

  .x-slider .noUi-handle {
    height: 30px;
    width: 30px;
    top: -13px;
    right: -15px;
    padding: 5px;
    border: 1px solid #000000;
    border-radius: 50%;
    box-shadow: none;
    cursor: pointer;
  }

  .x-slider .noUi-handle:before,
  .x-slider .noUi-handle:after {
    content: none;
  }

  .x-slider .noUi-handle-lower {
    padding-right: 7px;
  }

  .x-slider .noUi-touch-area {
    transform: rotate(90deg);
  }

  .x-slider .noUi-handle-upper {
    padding-left: 7px;
  }

  .x-slider .noUi-touch-area {
    transform: rotate(-90deg);
  }
</style>
