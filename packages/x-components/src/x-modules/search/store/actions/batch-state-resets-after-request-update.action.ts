import { isArrayEmpty } from '../../../../utils/array';
import { InternalSearchRequest } from '../../types';
import { SearchXStoreModule } from '../types';

const baseKeys: (keyof InternalSearchRequest)[] = [
  'filters',
  'page',
  'query',
  'relatedTags',
  'selectedFilters',
  'sort'
];

/**
 * Default implementation for the {@link SearchActions.batchStateResetsAfterRequestUpdate}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const batchStateResetsAfterRequestUpdate: SearchXStoreModule['actions']['batchStateResetsAfterRequestUpdate'] =
  ({ commit }, { newRequest, oldRequest }) => {
    const keys = getKeysWithDifferentValue<InternalSearchRequest>(newRequest, oldRequest);
    const hasExtraParamsKeys = keys.some(key => !baseKeys.includes(key));

    if (!isArrayEmpty(keys)) {
      if (!keys.includes('page')) {
        commit('setPage', 1);
      }
      if (keys.includes('query')) {
        commit('setSort', '');
      }
      if (hasExtraParamsKeys) {
        commit('setFacets', []);
        commit('setPage', 1);
        commit('setSort', '');
      }
    }
  };

/**
 * Compares two objects of the same type, checking the values of their keys and retrieving those
 * that were not present in the old value and/or those whose value has changed.
 *
 * @param newValue - The new object value.
 * @param oldValue - The old object value.
 *
 * @returns An array of keys.
 * @internal
 */
function getKeysWithDifferentValue<ObjectType extends Record<string, unknown>>(
  newValue: ObjectType,
  oldValue: ObjectType
): (keyof ObjectType)[] {
  const newKeys = Object.keys(newValue);
  const oldKeys = Object.keys(oldValue);

  return newKeys.filter(
    key => !oldKeys.includes(key) || newValue[key] !== oldValue[key]
  ) as (keyof ObjectType)[];
}
