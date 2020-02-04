import { CallbackInfo } from './callback-info.model';
import { NamedModel } from './named-model.model';
import { Tagging } from './tagging.model';

/**
 * @public
 * A banner is an image with a title, that when clicked redirect the user to an URL
 * Often it is represented as a 100% wide element on the grid that appears on top of the results or between rows.
 */
export interface Banner extends NamedModel, CallbackInfo {
  /**
   * A unique ID that identifies each banner
   */
  id: string;
  title: string;
  url: string;
  image: string;
  tagging: {
    click: Tagging;
  };
}
