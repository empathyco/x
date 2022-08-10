import { extractValue } from './extract-value';

/**
 * Syntax to detect and extract string parameters. A string parameter contains a property name
 * with an optional header or tail to concatenate wrapped in curly braces (`{}`).
 * The different parts of a string parameter are explained in {@link STRING_PARAMETER_CONTENT}.
 *
 * @example Different string parameters
 * ```js
 *   "\{env\}" // No optional head or tail.
 *   "\{(.)env\}" // Optional `.` head.
 *   "\{env(-api)\}" // Optional `-api` tail.
 *   "\{(api-)env(.)\}" // Optional `api-` head and `.` tail.
 * ```
 * @internal
 */
const STRING_PARAMETERS = /{([^}]+)}/g;

/**
 * Shape of the optional head and tail parts of the {@link STRING_PARAMETER_CONTENT} regex.
 * This can be anything wrapped into parentheses.
 *
 * @internal
 */
const HEAD_OR_TAIL = '(?:\\((.+)\\))?';
/**
 * Syntax of a single string parameter. A string parameter shape is composed by
 * the name of the property that should be replaced. This property name can be preceded
 * or followed by an optional string to prepend or to append to the property value
 * in case it is defined.
 *
 * @example Valid string parameters content
 * ```js
 *   "env" // No optional head or tail to concatenate.
 *   "(.)env" // The `.` character will be prepended as long as the `env` property is defined.
 *   "env(-api)" // The `-api` string will be appended as long as the `env` property is defined.
 *   "(api-)env(.)" // The `api-` string and the `.` character will be added as long as
 *   // the `env` property is defined.
 * ```
 * @internal
 */
const STRING_PARAMETER_CONTENT = new RegExp(`^${HEAD_OR_TAIL}([^(]+)${HEAD_OR_TAIL}$`, 'g');

/**
 * Interpolates different parameters into a string.
 * The provided string can set the parameters to replace wrapping a parameter name in curly
 * braces. This will then be replaced by the parameter value as long as it is defined. If it
 * is not provided, the parameter  name will just be removed from the final string.
 *
 * @param string - The string to interpolate different parameters in.
 * @param parameters - Value of the different parameters to interpolate.
 * @returns The interpolated string.
 * @example Different usages of the interpolate function.
 * ```js
 *  interpolate('https://{env}.empathy.co/{instance}', {
 *    env: 'live',
 *    instance: 'demo'
 *  })     // 'https://live.empathy.co/demo'
 *
 *  interpolate('https://{(api-)env}.empathy.co/{instance}', {
 *    env: 'live',
 *    instance: 'demo'
 *  }) // 'https://api-live.empathy.co/demo'
 *
 *  interpolate('https://api.{env(.)}empathy.co/{instance}', {
 *    env: 'live',
 *    instance: 'demo'
 *  }) // 'https://api.live.empathy.co/demo'
 *
 *  interpolate('https://{(api-)env(.)}empathy.co/{instance}', {
 *    env: 'live',
 *    instance: 'demo'
 *  }) // 'https://api-live.empathy.co/demo'
 *
 *  interpolate('https://{env}.empathy.co/{instance}', {
 *    env: 'live'
 *  }) // 'https://live.empathy.co/'
 *
 *  interpolate('https://search{(api-)env}.empathy.co/{instance}', {
 *    instance: 'demo'
 *  }) // 'https://search.empathy.co/demo'
 *
 *  interpolate('https://api.{env(.)}empathy.co/{instance}', {
 *    instance: 'demo'
 *  }) // 'https://api.empathy.co/demo'
 *
 *  interpolate('https://search.{(api-)env(.)}empathy.co/{instance}', {
 *    instance: 'demo'
 *  }) // 'https://search.empathy.co/demo'
 * ```
 * @public
 */
export function interpolate(string: string, parameters: Record<string, unknown>): string {
  return string.replace(STRING_PARAMETERS, (_match, propertyToReplace: string) =>
    propertyToReplace.replace(
      STRING_PARAMETER_CONTENT,
      (_match, head = '', property: string, tail = '') => {
        const value = extractValue(parameters, property);
        /* As the replacer function has a very dynamic signature, it is typed as a function with
         * `any` arguments. This makes it impossible for TS to infer the correct `string`
         * type that we are using as default values here. */
        return value != null ? `${String(head)}${String(value)}${String(tail)}` : '';
      }
    )
  );
}
