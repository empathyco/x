import { UrlParams } from '../../../types/url-params';

/**
 * The initial state of the Url store module. This is exported and used in other parts of the code
 * to use as default values for {@link UrlState}.
 *
 * @internal
 */
export const initialUrlState: Readonly<UrlParams> = {
  query: '',
  page: 1,
  filter: [],
  sort: '',
  scroll: 0,
  tag: []
};
