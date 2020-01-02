export type Dictionary<T = any> = Record<string, T>;
export type PropsWithType<Type, PropType> = {
  [Key in keyof Type]: Type[Key] extends PropType ? Key : never
}[keyof Type];
