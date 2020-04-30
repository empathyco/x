import React from 'react';
import Vue, { ComponentOptions } from 'vue';
import { VueWrapper } from '../../../vue-wrapper';
import { TitleMessage } from './react-title-message.stub';

export interface VueChangingComponentData {
  reactComponent: React.Component<any, any> | React.FunctionComponent<any>;
}

type VueChangingComponentThis = ThisType<Vue & VueChangingComponentData>

export const VueChangingComponent: ComponentOptions<Vue, () => VueChangingComponentData, object> & VueChangingComponentThis = {
  data() {
    return {
      reactComponent: TitleMessage
    }
  },
  render(h) {
    return h(VueWrapper, {
      props: {
        reactComponent: this.reactComponent,
        reactProps: { message: 'Good morning sir!' }
      }
    });
  }
}
