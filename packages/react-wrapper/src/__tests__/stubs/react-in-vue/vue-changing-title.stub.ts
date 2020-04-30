import Vue,{ ComponentOptions } from 'vue';
import { VueWrapper } from '../../../vue-wrapper';
import { TitleMessage } from './react-title-message.stub';

export interface VueChangingTitleData {
  message: string;
}

type VueChangingTitleThis = ThisType<Vue & VueChangingTitleData>;

export const VueChangingTitle: ComponentOptions<Vue, () => VueChangingTitleData, object> & VueChangingTitleThis = {
  data() {
    return {
      message: 'Hello'
    }
  },
  render(h) {
    return h(VueWrapper, {
      props: {
        reactComponent: TitleMessage,
        reactProps: this.$data
      }
    });
  }
}
