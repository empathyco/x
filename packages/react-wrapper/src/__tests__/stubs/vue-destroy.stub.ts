import Vue, { ComponentOptions } from 'vue';

interface VueDestroyedProps {
  count: number
}

export const vueDestroyedCallback = jest.fn();
export const VueDestroyed: ComponentOptions<Vue> & ThisType<Vue & VueDestroyedProps> = {
  props: {
    count: Number
  },
  render(h) {
    return h('p', {}, [this.count.toString()]);
  },
  destroyed: vueDestroyedCallback
};
