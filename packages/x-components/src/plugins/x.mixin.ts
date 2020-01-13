import Vue, { ComponentOptions } from 'vue';
import { BaseXBus } from './x.bus';
import { XComponentAPI } from './x.types';

declare module 'vue/types/vue' {
  export interface Vue {
    $x: XComponentAPI;
  }
}

export const CreateXComponentAPIMixin: ComponentOptions<Vue> & ThisType<Vue> = {
  beforeCreate(): void {
    const bus = new BaseXBus(this); // TODO Inject the constructor of this component
    this.$x = {
      emit: bus.emit.bind(bus),
      on: bus.on.bind(bus)
    };
  }
};
