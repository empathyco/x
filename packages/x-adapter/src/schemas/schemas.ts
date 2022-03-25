import { PropertyPath, PropertyType, Primitive } from '@empathyco/x-utils';

type Schema<Source, Target> = {
  [TargetKey in keyof Target]:
    | PropertyPath<Source>
    | ((source: Source) => any)
    | Schema<Source, Exclude<Target[TargetKey], Function | Primitive | Array<any>>>
    | {
        path: PropertyPath<Source>;
        schema: Schema<
          Exclude<PropertyType<Source, PropertyPath<Source>>, Function | Primitive | Array<any>>,
          Target[TargetKey]
        >;
      };
};

const source = {
  data: {
    a: 'a',
    b: 1
  },
  facets: {
    filter: 'Soy un filter',
    count: 10
  },
  lista: { asdf: 'primerElemento' }
};

type SourceTest = typeof source;

const filterSchema: Schema<SourceTest['facets'], TargetTest['filter']> = {
  value: ({ filter }) => filter.toUpperCase(),
  num: 'count'
};

const schema: Schema<SourceTest, TargetTest> = {
  name: {
    title: 'data.a'
  },
  count: 'data.b',
  filter: {
    path: 'facets',
    schema: {
      value: 'filter',
      num: 'count'
    }
  },
  otra: {
    cosa: 'lista.asdf',
    numero: 'facets.count'
  }
};

type TargetTest = typeof destination;

const destination = {
  name: {
    title: 'a'
  },
  count: 1,
  filter: { value: 'Soy un filter', num: 10 },
  otra: {
    cosa: 'cosa',
    numero: 3
  }
};
