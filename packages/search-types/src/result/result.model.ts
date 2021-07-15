import { CallbackInfo } from '../callback-info.model';
import { Identifiable } from '../identifiable.model';
import { NamedModel } from '../named-model.model';
import { ResultIdentifier } from './result-identifier.model';
import { ResultPrice } from './result-price.model';
import { ResultRating } from './result-rating.model';
import { ResultTagging } from './result-tagging.model';

/**
 * A search result.
 *
 * @public
 */
export interface Result extends NamedModel, CallbackInfo, Identifiable {
  /** The type of the result. i.e. product, article, pack... */
  type: string;
  /** Images of the result. It should be the URLs. */
  images: string[];
  /** Result name. */
  name: string;
  /** {@link ResultPrice | Result price}.  */
  price: ResultPrice;
  /** {@link ResultRating | Result rating}.  */
  rating: ResultRating;
  /** {@link ResultTagging | Result tagging}.  */
  tagging: ResultTagging;
  /** {@link ResultIdentifier | Result identifier}.  */
  identifier: ResultIdentifier;
  /** Result URL to redirect to PDP.  */
  url: string;
  /** Flag if the results has been added to the wishlist or not. */
  isWishlisted: boolean;
}
