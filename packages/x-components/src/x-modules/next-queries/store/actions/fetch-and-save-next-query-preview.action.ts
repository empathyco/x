import { NextQueriesActionContext } from '../types';
import { cancellablePromise, CancelSymbol } from '../../../../utils/cancellable-promise';

let cancelPromise: undefined | (() => void);

const fetchAndSave = (
  { dispatch, commit }: NextQueriesActionContext,
  nextQuery: string
): Promise<void> => {
  commit('setStatus', 'loading');

  const { promise, cancel } = cancellablePromise(dispatch('fetchNextQueryPreview', nextQuery));
  cancelPromise = cancel;

  return promise
    .then(response => {
      if (response) {
        commit('setResults', {
          nextQuery,
          results: {
            totalResults: response.totalResults,
            items: response.results
          }
        });
      }
      commit('setStatus', 'success');
    })
    .catch(error => {
      if (error !== CancelSymbol) {
        commit('setStatus', 'error');
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
};

const cancel = (): void => {
  cancelPromise?.();
};

export const fetchAndSaveNextQueryPreview = fetchAndSave;

export const cancelFetchAndSaveNextQueryPreview = cancel;
