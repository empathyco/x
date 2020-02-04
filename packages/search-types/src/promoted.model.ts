import { CallbackInfo } from './callback-info.model';
import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

/**
 * @public
 * A promoted is an image with a title, that when clicked redirect the user to an URL
 * Often it is represented taking up the same space than a normal result
 */
export interface Promoted extends NamedModel, CallbackInfo {
  /**
   * A unique ID that identifies each promoted
   */
  id: string;
  title: string;
  url: string;
  image: string;
  tagging: {
    click: Tagging;
  };
}
