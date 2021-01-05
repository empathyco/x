import Vue from 'vue';
import { VNode } from 'vue/types/vnode';

export const VueInput = Vue.extend({
  data(): { value: string } {
    return {
      value: ''
    };
  },
  methods: {
    setValue(newValue: string): void {
      this.value = newValue;
    }
  },
  render(h): VNode {
    const defaultSlotScope: VueInputDefaultSlotScope = {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      setValue: this.setValue,
      value: this.value
    };
    return h('div', [
      this.$scopedSlots.default!(defaultSlotScope),
      h('span', `Value: ${this.value}`)
    ]);
  }
});

export interface VueInputDefaultSlotScope {
  value: string;
  setValue(newValue: string): void;
}
