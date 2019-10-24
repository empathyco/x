import { NamedModel } from '../named-model.model';
import { Filter } from './filter.model';

export interface Facet extends NamedModel {
  filters: Filter[];
  title: string;
}
