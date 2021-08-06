/**
 * Type to define a JSON structure.
 *
 * @public
 */
export type JSON = Record<string, unknown>;

/**
 * Type to define the parameters received when the script is call.
 **/
export interface CommandParameters {
  sourcePath: string;
  targetPath?: string;
}
