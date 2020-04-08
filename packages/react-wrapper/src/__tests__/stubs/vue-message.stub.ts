import Vue, { ComponentOptions } from 'vue';

interface VueMessageProps {
  message: string
}

export const VueMessage: ComponentOptions<Vue> & ThisType<Vue & VueMessageProps> = {
  props: {
    message: {
      default: 'Hello world!',
      type: String
    }
  },
  render(h) {
    return h('p', {}, [this.message]);
  }
};
