import { DynamicOptions, TailwindHelpers } from '../types';

export default function dynamicComponents({ theme }: TailwindHelpers): DynamicOptions {
  return [
    {
      btn: (value: any) => ({
        backgroundColor: value['50']
      }),
      icon: (value: any) => ({
        backgroundColor: value['100']
      })
    },
    {
      values: theme('colors')
    }
  ];
}
