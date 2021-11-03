import { FilterEntityFactory } from '../entities/filter-entity.factory';
import { DefaultFacetsService } from '../service/facets.service';

/**
 * Resets the {@link DefaultFacetsService} instance with a new {@link FilterEntityFactory}.
 *
 * @internal
 */
export function resetFacetsService(): void {
  DefaultFacetsService.instance = new DefaultFacetsService(new FilterEntityFactory());
}
