import { EmpathyAdapterBuilder } from '../builder/empathy-adapter.builder';

export const adapter = new EmpathyAdapterBuilder().withConfiguration({
  instance: 'juguettos',
  env: 'staging',
  requestParams: { lang: 'es' }
}).build();
