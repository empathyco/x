import { CallbackInfo } from '../callback-info.model';
import { NamedModel } from '../named-model.model';
import { ResultIdentifier } from './result-identifier.model';
import { ResultPrice } from './result-price.model';
import { ResultRating } from './result-rating.model';
import { ResultTagging } from './result-tagging.model';

/**
 * @public
 * A search result
 */
export interface Result extends NamedModel, CallbackInfo {
  /**
   * A unique ID that identifies each result
   */
  id: string;
  /**
   * The type of the result. i.e. product, article, pack...
   */
  type: string;
  images: string[];
  name: string;
  price: ResultPrice;
  rating: ResultRating;
  tagging: ResultTagging;
  identifier: ResultIdentifier;
  url: string;
  isWishlisted: boolean;
}
