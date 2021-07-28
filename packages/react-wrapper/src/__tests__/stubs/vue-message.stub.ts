import Vue, { ComponentOptions } from 'vue';
import { MessageProps } from './stub.types';

export const VueMessage: ComponentOptions<Vue> & ThisType<Vue & MessageProps> = {
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
