import { UrlState } from './types';

/**
 * The initial state of the Url store module. This is exported and used in other parts of the code
 * to use as default values for {@link UrlState}.
 *
 * @internal
 */
export const initialUrlState: UrlState = {
  params: {
    query: '',
    page: 1,
    filter: [],
    sort: '',
    scroll: 0,
    tag: []
  },
  extraParams: {}
};
