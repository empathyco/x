import Vue, { ComponentOptions } from 'vue';
import { VueWrapper } from '../../../vue-wrapper';
import { TitleMessage } from './react-title-message.stub';

export const VueTitleMessage: ComponentOptions<Vue> = {
  render(h) {
    return h(VueWrapper, {
      props: {
        reactComponent: TitleMessage
      }
    });
  }
}
