import { NamedModel } from '../named-model.model';
import { ResultIdentifier } from './result-identifier.model';
import { ResultPrice } from './result-price.model';
import { ResultRating } from './result-rating.model';
import { ResultTagging } from './result-tagging.model';

export interface Result extends NamedModel {
  id: string;
  type?: string;
  images: string[];
  name: string;
  price?: ResultPrice;
  rating?: ResultRating;
  tagging: ResultTagging;
  identifier?: ResultIdentifier;
  url: string;
  callbackInfo?: any;
}
