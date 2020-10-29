import { defineComponent } from '../../../src/vue-creator.utils';

export const VueTransitionSlot = defineComponent({
  props: {
    message: {
      default: 'Hello world!',
      type: String
    },
    show: {
      required: true,
      type: Boolean
    },
    transitionDuration: {
      required: true,
      type: Number
    }
  },
  render(h) {
    const slot = this.$scopedSlots.default?.(this.message) ?? h();
    const div = this.show ? h('div', [slot]) : h();
    return h(
      'transition',
      {
        props: { duration: this.transitionDuration }
      },
      [div]
    );
  }
});
