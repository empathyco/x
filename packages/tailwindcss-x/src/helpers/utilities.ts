import { TailwindHelpers } from '../types';

export default function utilities(_tailwindHelpers: TailwindHelpers): any {
  return {
    '.content-auto': {
      'content-visibility': 'auto'
    },
    '.content-hidden': {
      'content-visibility': 'hidden'
    },
    '.content-visible': {
      'content-visibility': 'visible'
    }
  };
}
