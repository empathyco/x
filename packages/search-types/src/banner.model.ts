import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

export interface Banner extends NamedModel {
  id: string;
  title: string;
  url: string;
  image: string;
  tagging: {
    click: Tagging;
  };
}
