import { DEPENDENCIES } from './container/container.const';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type EntityNames = Exclude<keyof (typeof DEPENDENCIES)['ResponseMappers'], 'Helpers'>;
