import Vue, { ComponentOptions, VNodeChildren } from 'vue';

interface VueSlotsProps {
  message: string;
}

export const VueSlots: ComponentOptions<Vue> & ThisType<Vue & VueSlotsProps> = {
  props: {
    message: {
      default: 'Hello world!',
      type: String
    }
  },
  render(h) {
    const children: VNodeChildren = [this.$slots.default];
    if (this.$scopedSlots.scoped) {
      children.unshift(h('section', {}, this.$scopedSlots.scoped(this.message)));
    }
    return h('div', {}, children);
  }
};
