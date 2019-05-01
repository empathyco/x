export type BindingTree = Record<keyof any, Binding>;

export interface Binding {
  to: any;
  dependencies?: BindingTree;
}
