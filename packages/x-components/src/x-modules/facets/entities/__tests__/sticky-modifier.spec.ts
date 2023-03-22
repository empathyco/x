import { createSimpleFilter } from '../../../../__stubs__/index';
import { StickyModifier } from '../sticky.modifier';
import { SimpleFilterEntity } from '../simple-filter.entity';
import { isFilterSelected, prepareFacetsStore } from './utils';

describe('testing sticky modifier', () => {
  it('keeps filters selected', () => {
    const redColorFilter = createSimpleFilter('color', 'red', true);
    const blueColorFilter = createSimpleFilter('color', 'blue', true);
    const store = prepareFacetsStore([redColorFilter, blueColorFilter]);
    const entity = new StickyModifier(store, new SimpleFilterEntity(store));

    entity.deselect(redColorFilter, { keepSticky: true });
    entity.deselect(blueColorFilter);

    expect(isFilterSelected(store, redColorFilter.id)).toBe(true);
    expect(isFilterSelected(store, blueColorFilter.id)).toBe(false);
  });
});
