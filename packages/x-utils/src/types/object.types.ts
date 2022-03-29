/**
 * Tree-shakes the provided object returning another one with only the keys that match the given
 * type.
 *
 * @remarks By default, ExcludeOptional is false, so optional properties are included.
 *
 * @param SomeObject - The object to tree-shake.
 * @param Type - The type of the properties to preserve.
 * @param ExcludeOptional - Flag to exclude optional properties.
 *
 * @public
 */
export type TreeShakeObject<SomeObject, Type, ExcludeOptional extends boolean = false> = {
  [Property in keyof SomeObject as SomeObject[Property] extends (
    ExcludeOptional extends true ? Type | object : Type | object | undefined
  )
    ? Property
    : // eslint-disable-next-line @typescript-eslint/ban-types
      never]: SomeObject[Property] extends object
    ? TreeShakeObject<SomeObject[Property], Type, ExcludeOptional>
    : SomeObject[Property];
};
