import { NextQueriesResponse } from '@empathyco/x-adapter';
import { createNextQueryStub } from '../../../../../src/__stubs__/next-queries-stubs.factory';

export const nextQueriesStub: NextQueriesResponse = {
  nextQueries: [
    createNextQueryStub('lego'),
    createNextQueryStub('camion'),
    createNextQueryStub('marvel')
  ]
};
