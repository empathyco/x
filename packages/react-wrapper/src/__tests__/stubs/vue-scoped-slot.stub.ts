import Vue, { ComponentOptions } from 'vue';

interface VueSlotsProps {
  message: string
}

export const VueScopedSlot: ComponentOptions<Vue> & ThisType<Vue & VueSlotsProps> = {
  props: {
    message: {
      required: true,
      type: String
    }
  },
  render(h) {
    return h('section', {}, [
      this.$scopedSlots.scoped?.(`Vue says: ${this.message}`)
    ]);
  }
};
