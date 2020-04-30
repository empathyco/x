import Vue, { ComponentOptions } from 'vue';
import { VueWrapper } from '../../../vue-wrapper';
import { ReactDestroyed } from './react-destroy.stub';

interface VueToggleComponentData {
  renderReactComponent: boolean;
  count: number
}

type VueToggleComponentThis = ThisType<Vue & VueToggleComponentData>

export const VueToggleComponent: ComponentOptions<Vue, () => VueToggleComponentData, object> & VueToggleComponentThis = {
  data() {
    return {
      renderReactComponent: true,
      count: 0
    };
  },
  render(h) {
    return this.renderReactComponent
      ? h(VueWrapper, {
        props: {
          reactComponent: ReactDestroyed,
          reactProps: { count: this.count }
        }
      })
      : h();
  }
};
