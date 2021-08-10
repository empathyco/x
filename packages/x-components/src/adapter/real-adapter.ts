import { EmpathyAdapterBuilder } from '@empathyco/x-adapter';
import { configureAdapterWithJuguettos } from './util';

export const realAdapter = configureAdapterWithJuguettos(new EmpathyAdapterBuilder()).build();
