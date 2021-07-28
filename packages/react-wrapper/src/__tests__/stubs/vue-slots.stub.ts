import Vue, { ComponentOptions, VNodeChildren } from 'vue';
import { MessageProps } from './stub.types';

export const VueSlots: ComponentOptions<Vue> & ThisType<Vue & MessageProps> = {
  props: {
    message: {
      default: 'Hello world!',
      type: String
    }
  },
  render(h) {
    const children: VNodeChildren = [this.$slots.default];
    if (this.$scopedSlots.scoped) {
      const scope: MessageProps = { message: this.message };
      children.unshift(h('section', {}, this.$scopedSlots.scoped(scope)));
    }
    return h('div', {}, children);
  }
};
