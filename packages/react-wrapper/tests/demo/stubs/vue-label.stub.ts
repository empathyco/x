import Vue, { ComponentOptions } from 'vue';

interface VueSlotsProps {
  label: string;
}

export const VueLabel: ComponentOptions<Vue> & ThisType<Vue & VueSlotsProps> = {
  props: {
    label: { type: String, required: true }
  },
  render(h) {
    return h('div', this.$scopedSlots.default?.({ label: this.label }) ?? []);
  }
};
