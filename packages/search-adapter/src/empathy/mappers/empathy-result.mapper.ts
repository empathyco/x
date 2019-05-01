import { Result } from '@empathy/search-types';
import { injectable } from 'inversify';
import { Mapper } from '../empathy-adapter.types';
import { EmpathyResult } from '../models/empathy-result.model';

@injectable()
export class EmpathyResultMapper implements Mapper<EmpathyResult, Result> {
  map(rawResult: EmpathyResult): Result {
    return {
      modelName: 'Result',
      type: 'default',
      id: rawResult.id,
      name: rawResult.name ? rawResult.name.toLowerCase() : '',
      url: rawResult.url,
      images: rawResult.image ? [rawResult.image] : [],
      price: {
        value: Number.parseFloat(rawResult.price),
        originalValue: Number.parseFloat(rawResult.originalPrice || rawResult.price)
      },
      rating: {
        value: Number.parseFloat(rawResult.rating)
      },
      identifier: rawResult.eb_sku ? {
        value: rawResult.eb_sku,
        html: rawResult.eb_sku
      } : undefined
    };
  }
}
