import { NamedModel } from '../named-model.model';

export interface SemanticQuery extends NamedModel<'SemanticQuery'> {
  query: string;
  distance: number;
}
