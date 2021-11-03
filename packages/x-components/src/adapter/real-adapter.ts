import { EmpathyAdapterBuilder } from '@empathyco/x-adapter';
import { configureAdapterWithToysrus } from './util';

export const realAdapter = configureAdapterWithToysrus(new EmpathyAdapterBuilder()).build();
