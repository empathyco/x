import { PropertyPath, PropertyType, Primitive } from '@empathyco/x-utils';

type Schema<Source, Target> = {
  [TargetKey in keyof Target]:
    | PropertyPath<Source>
    | ((source: Source) => any)
    | Schema<Source, Exclude<Target[TargetKey], Function | Primitive>>
    | {
        path: PropertyPath<Source>;
        schema: Schema<
          Exclude<PropertyType<Source, PropertyPath<Source>>, Function | Primitive>,
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
  value: param => ('filter' in param ? param.filter : null),
  num: 'count'
};

const schema: Schema<SourceTest, TargetTest> = {
  name: {
    title: ({ data: { a } }) => a
  },
  count: 'data.b',
  filter: {
    path: 'facets',
    schema: {
      value: param => ('filter' in param ? param.filter : null),
      num: 'count'
    }
  },
  otra: {
    cosa: 'lista.asdf',
    numero: 'facets.count',
    filter: {
      path: 'facets',
      schema: {
        value: param => ('filter' in param ? param.filter : null),
        num: 'count'
      }
    }
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
    numero: 3,
    filter: { value: 'Soy un filter', num: 10 }
  }
};
