import { TopRecommendationsResponse } from '@empathyco/x-adapter';
import { createResultStub } from '../../../../../src/__stubs__/results-stubs.factory';

export const recommendationsStub: TopRecommendationsResponse = {
  results: [
    createResultStub('Piscina 3 Anillos'),
    createResultStub('Among Us Figura Acción'),
    createResultStub('Barbie Sirenas Dreamtopia')
  ]
};
