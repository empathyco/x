import { CallbackInfo } from './callback-info.model';
import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

export interface Promoted extends NamedModel, CallbackInfo {
  id: string;
  title: string;
  url: string;
  image: string;
  tagging: {
    click: Tagging;
  };
}
