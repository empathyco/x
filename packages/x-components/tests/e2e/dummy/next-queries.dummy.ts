import { NextQueriesResponse } from '../../../../search-adapter/types/types/response.types';
import { getNextQueriesStub } from '../../../src/__stubs__/next-queries-stubs.factory';

export const nextQueriesDummy: NextQueriesResponse = {
  nextQueries: getNextQueriesStub()
};
