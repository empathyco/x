import { DEPENDENCIES } from './container/container.const';

export type EntityNames = Exclude<keyof (typeof DEPENDENCIES)['ResponseMappers'], 'Helpers'>;
