import {
  ComponentsDefinition,
  DynamicComponentsDefinition,
  DynamicUtilitiesDefinition,
  PluginOptions,
  UtilitiesDefinition
} from '../src/types';

export const options: PluginOptions = {
  components(): ComponentsDefinition {
    return {};
  },
  utilities(): UtilitiesDefinition {
    return {};
  },
  dynamicUtilities(): DynamicUtilitiesDefinition {
    return {};
  },
  dynamicComponents(): DynamicComponentsDefinition {
    return {};
  },
  theme: {}
};
