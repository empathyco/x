import { NamedModel } from '../named-model.model';
import { NextQuery } from './next-query.model';

export interface NextQueries extends NamedModel {
  id: string;
  nextQueries: NextQuery[];
}
