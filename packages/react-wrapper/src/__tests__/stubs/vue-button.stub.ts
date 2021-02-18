import Vue, { ComponentOptions } from 'vue';
import { MessageProps } from './stub.types';

export const VueButton: ComponentOptions<Vue> & ThisType<Vue & MessageProps> = {
  props: {
    message: {
      default: 'Hello world!',
      type: String
    }
  },
  created(): void {
    this.$emit('VueButtonCreated', this.message);
  },
  mounted(): void {
    this.$emit('VueButtonMounted', this.message);
  },
  render(h) {
    return h(
      'button',
      {
        on: {
          click: () => {
            this.$emit('VueButtonClickedFirstEvent', this.message);
            this.$emit('VueButtonClickedSecondEvent', this.message);
          }
        }
      },
      [this.message]
    );
  }
};
