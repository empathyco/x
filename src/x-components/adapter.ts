import { EmpathyAdapterBuilder } from '@empathy/search-adapter';

export const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setEnvironment('staging')
  .setLang('es')
  .setScope('desktop')
  .build();

