import { PropertyPath, PropertyType } from '@empathyco/x-utils';

type Schema<Source, Target> = {
  [TargetKey in keyof Target]: PropertyPath<Source> | Schema<Source, Target[TargetKey]>;
};

const source = {
  data: {
    a: 'a',
    b: 1
  }
};

const schema: Schema<typeof source, typeof destination> = {
  name: {
    title: 'data.a'
  },
  count: 'data.b'
};

const destination = {
  name: {
    title: 'a'
  },
  count: 1
} as const;
