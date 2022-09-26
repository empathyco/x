import {
  ComponentsDefinition,
  DynamicComponentsDefinition,
  DynamicUtilitiesDefinition,
  PluginOptions,
  UtilitiesDefinition
} from '../src/types';

export const options: PluginOptions = {
  components(helpers): ComponentsDefinition {
    const { theme } = helpers;
    return {
      '.icon': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: theme('spacing.16'),
        height: theme('spacing.16'),
        color: 'currentColor',
        fontSize: theme('spacing.8')
      }
    };
  },
  utilities({ theme }): UtilitiesDefinition {
    return {
      '.btn-height': {
        '&-sm': {
          height: theme('height.2')
        },
        '&-md': {
          height: theme('height.4')
        },
        '&-lg': {
          height: theme('height.8')
        }
      }
    };
  },
  dynamicUtilities({ theme }): DynamicUtilitiesDefinition {
    return {
      'background-success': {
        styles: (value: any) => ({
          backgroundColor: value
        }),
        values: theme('colors.success')
      },
      'font-util': {
        styles: (value: any) => ({
          fontSize: value,
          backgroundColor: 'red'
        }),
        values: theme('spacing')
      },
      'btn-height': {
        styles: (value: any) => ({
          height: value
        })
      }
    };
  },
  dynamicComponents(): DynamicComponentsDefinition {
    return {};
  },
  theme: {
    colors: {},
    height: {
      1: '10px',
      2: '20px',
      4: '40px',
      8: '80px'
    }
  }
};
