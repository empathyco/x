import { Result, ResultVariant } from '@empathyco/x-types';
import { ListItem } from '../../utils/types';

/**
 * Type of the key passed to {@link XProvide} and {@link XInject} to be type-safe. With this type
 * you can declare the type of the injected value directly in the injection key.
 *
 * @example
 * `const myKey: XInjectKey<Filter> = 'myFilter';`
 * `@XInject(myKey)`
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface XInjectKey<Type> extends String {}

/**
 * It's used to identify the provided and injected `disable-animations`.
 *
 * @internal
 */
export const DISABLE_ANIMATIONS_KEY: XInjectKey<boolean | undefined> = 'disable-animations';

/**
 * It's used to identify the provided and injected `items`.
 *
 * @internal
 */
export const LIST_ITEMS_KEY: XInjectKey<ListItem[] | undefined> = 'listItems';

/**
 * It's used to identify the provided and injected `query`.
 *
 * @internal
 */
export const QUERY_KEY: XInjectKey<string | undefined> = 'query';

/**
 * It's used to identify the provided and injected `hasMoreItems`.
 *
 * @internal
 */
export const HAS_MORE_ITEMS_KEY: XInjectKey<boolean | undefined> = 'hasMoreItems';

/**
 * It's used to identify the provided and injected `result`.
 *
 * @internal
 */
export const RESULT_WITH_VARIANTS_KEY: XInjectKey<Result> = 'resultWithVariants';

/**
 * It's used to identify the provided and injected `selectedVariants` of a result.
 *
 * @internal
 */
export const SELECTED_VARIANTS_KEY: XInjectKey<ResultVariant[]> = 'selectedVariants';

/**
 * It's used to identify the provided and injected `selectResultVariant` callback.
 *
 * @internal
 */
export const SELECT_RESULT_VARIANT_KEY: XInjectKey<
  (variant: ResultVariant, level?: number) => void
> = 'selectResultVariant';
