import Vue from 'vue';
import { MessageProps } from '../../../src/__tests__/stubs/stub.types';

export const VueTransitionSlot = Vue.extend({
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
    const scope: MessageProps = { message: this.message };
    const slot = this.$scopedSlots.default?.(scope) ?? h();
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
