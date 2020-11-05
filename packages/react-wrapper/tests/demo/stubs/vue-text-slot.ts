import { defineComponent } from '../../../src/vue-creator.utils';

export const VueTextSlot = defineComponent({
  props: {
    'data-test': {
      type: String
    }
  },
  render(h) {
    return h(
      'h1',
      { attrs: { 'data-test': this.$props.dataTest } },
      this.$slots.default ?? 'default slot content'
    );
  }
});
