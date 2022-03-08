type ObjectKeys<SomeObject, Type> = Extract<keyof SomeObject, Type>;

type DeepInPropertyTypes = Record<string, unknown> | unknown[];

export type PropertyPath<SomeObject> = SomeObject extends unknown[]
  ? `${number}` | NestedPropertyPath<SomeObject, ObjectKeys<SomeObject, `${number}`>>
  : ObjectKeys<SomeObject, string> | NestedPropertyPath<SomeObject, ObjectKeys<SomeObject, string>>;

export type NestedPropertyPath<SomeObject, Path extends string> = Path extends keyof SomeObject
  ? NonNullable<SomeObject[Path]> extends DeepInPropertyTypes
    ? `${Path}.${PropertyPath<SomeObject[Path]>}`
    : never
  : never;

export type PropertyType<SomeObject, Path extends string> = Path extends keyof SomeObject
  ? SomeObject[Path]
  : Path extends `${infer Property}.${infer RemainingPath}`
  ? Property extends keyof SomeObject
    ? RemainingPath extends PropertyPath<SomeObject[Property]>
      ? PropertyType<NonNullable<SomeObject[Property]>, RemainingPath>
      : never
    : never
  : SomeObject extends (infer ArrayType)[]
  ? ArrayType
  : never;
