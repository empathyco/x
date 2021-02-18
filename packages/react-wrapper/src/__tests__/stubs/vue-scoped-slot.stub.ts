import Vue, { ComponentOptions } from 'vue';
import { MessageProps } from './stub.types';

export const VueScopedSlot: ComponentOptions<Vue> & ThisType<Vue & MessageProps> = {
  props: {
    message: {
      required: true,
      type: String
    }
  },
  render(h) {
    const scope: MessageProps = { message: `Vue says: ${this.message}` };
    return h('section', {}, [this.$scopedSlots.scoped?.(scope)]);
  }
};
