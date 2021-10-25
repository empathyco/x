import { SearchXStoreModule } from '../types';

export const redirect: SearchXStoreModule['actions']['redirect'] = (_state, redirection) => {
  window.location.replace(redirection.url);
};
