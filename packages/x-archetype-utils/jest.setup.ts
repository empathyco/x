import { config } from '@vue/test-utils';
config.mocks.$t = (key: string) => {
  return key;
};
