import { Identifiable } from '../identifiable.model';
import { NamedModel } from '../named-model.model';
import { Taggable } from '../tagging.model';
import { ResultIdentifier } from './result-identifier.model';
import { ResultPrice } from './result-price.model';
import { ResultRating } from './result-rating.model';

/**
 * A search result.
 *
 * @public
 */
export interface Result extends NamedModel<'Result'>, Identifiable, Taggable {
  /** The type of the result: product, article, pack, etc... */
  type?: string;
  /** Images of the result. It should be the URLs. */
  images?: string[];
  /** Result name. */
  name?: string;
  /** {@link ResultPrice | Result price}.  */
  price?: ResultPrice;
  /** {@link ResultRating | Result rating}.  */
  rating?: ResultRating;
  /** {@link ResultIdentifier | Result identifier}.  */
  identifier?: ResultIdentifier;
  /** Result URL to redirect to PDP.  */
  url?: string;
  /** Flag if the results has been added to the wishlist or not. */
  isWishlisted?: boolean;
  /** {@link ResultVariant | Variants of the result}.  */
  variants?: ResultVariant[];
}

/**
 * A result variant.
 *
 * @public
 */
export interface ResultVariant extends Omit<Result, 'id' | 'modelName' | 'tagging'> {}
